"""
SECUREASSESS - Docker Kali Scanner Runner
SIH 2026 Problem Statement ID: 26163 (NTRO)

Responsibilities:
- Manages execution of security tools within the isolated `kali-scanner` container.
- Hard Safety Constraint #3: kali-scanner operates on internal network with zero published ports.
- Hard Safety Constraint #6: Tool failure degrades to warning, never crashes the scan.
- Streams stdout lines and extracts JSON artifacts.
"""

from __future__ import annotations

import io
import logging
from pathlib import Path
import shutil
import subprocess
import sys
import tarfile
import time
from typing import Optional, Tuple

logger = logging.getLogger("secureassess.scanner.docker")

KALI_CONTAINER_NAME = "kali-scanner"


class DockerScannerRunner:
    """
    Client for executing DAST (ZAP, Nikto) and SAST (Semgrep, Gitleaks)
    inside the sandboxed Kali Linux environment (either via Docker or direct execution).
    """

    def __init__(self, container_name: str = KALI_CONTAINER_NAME):
        self.container_name = container_name
        self._client = None
        self._checked_availability = False
        self._available = False
        self._is_local = False

    def is_available(self) -> bool:
        """
        Checks if scanner environment is available:
        1. Local CLI execution (unified Linux container deployment, e.g. on Render).
        2. Sibling Docker container via daemon (local docker-compose).
        """
        if self._has_local_tools():
            self._is_local = True
            self._available = True
            return True

        try:
            import docker
            client = docker.from_env()
            container = client.containers.get(self.container_name)
            self._available = (container.status == "running")
            self._client = client
            self._is_local = False
            return self._available
        except Exception as e:
            logger.warning(f"Scanner container '{self.container_name}' is not reachable: {e}")
            self._available = False
            return False

    def _has_local_tools(self) -> bool:
        """Checks if running inside a Linux environment with scanning tools installed."""
        if not sys.platform.startswith("linux"):
            return False
        cli_tools = ["nikto", "semgrep", "gitleaks", "nmap"]
        return any(shutil.which(tool) is not None for tool in cli_tools)

    def exec_in_container(self, cmd: str, timeout_s: float = 120.0) -> Tuple[int, str]:
        """Executes a command inside the scanner environment and returns (exit_code, output)."""
        if not self.is_available():
            return -1, "Scanner environment unavailable. Degraded to warning."

        if self._is_local:
            try:
                res = subprocess.run(
                    cmd,
                    shell=True,
                    capture_output=True,
                    text=True,
                    timeout=timeout_s,
                )
                output = (res.stdout or "") + (res.stderr or "")
                return res.returncode, output
            except subprocess.TimeoutExpired:
                logger.warning(f"Command `{cmd}` timed out after {timeout_s}s")
                return -1, f"Command timed out after {timeout_s}s"
            except Exception as e:
                logger.warning(f"Error executing command `{cmd}` locally: {e}")
                return -1, f"Execution failed: {e}"

        if not self._client:
            return -1, "Docker client unavailable."

        try:
            container = self._client.containers.get(self.container_name)
            res = container.exec_run(cmd, demux=False)
            exit_code = res.exit_code
            output = res.output.decode("utf-8", errors="replace") if res.output else ""
            return exit_code, output
        except Exception as e:
            logger.warning(f"Error executing command `{cmd}` in container: {e}")
            return -1, f"Execution failed: {e}"

    def read_artifact_from_container(self, file_path: str) -> Optional[str]:
        """Retrieves a file generated inside the container workspace."""
        if not self.is_available():
            return None

        if self._is_local:
            p = Path(file_path)
            if p.exists() and p.is_file():
                try:
                    return p.read_text(encoding="utf-8", errors="replace")
                except Exception as e:
                    logger.warning(f"Failed to read local artifact '{file_path}': {e}")
                    return None
            return None

        if not self._client:
            return None

        try:
            container = self._client.containers.get(self.container_name)
            bits, _ = container.get_archive(file_path)
            tar_stream = io.BytesIO()
            for chunk in bits:
                tar_stream.write(chunk)
            tar_stream.seek(0)

            with tarfile.open(fileobj=tar_stream) as tar:
                member = tar.next()
                if member and member.isfile():
                    f = tar.extractfile(member)
                    if f:
                        return f.read().decode("utf-8", errors="replace")
            return None
        except Exception as e:
            logger.warning(f"Failed to read artifact '{file_path}' from container: {e}")
            return None

    # --------------------------------------------------------------------------
    # DAST Scanner Executions
    # --------------------------------------------------------------------------

    def run_zap_baseline(self, target: str) -> Tuple[int, str]:
        """
        Executes OWASP ZAP Baseline scan inside Kali sandbox.
        Command: zap-baseline.py -t <url> -J zap.json
        """
        cmd = f"zap-baseline.py -t {target} -J /tmp/workspace/zap.json"
        exit_code, stdout = self.exec_in_container(cmd, timeout_s=180.0)
        artifact = self.read_artifact_from_container("/tmp/workspace/zap.json")
        return exit_code, artifact or stdout

    def run_nikto(self, target: str) -> Tuple[int, str]:
        """
        Executes Nikto web server scan inside Kali sandbox.
        Command: nikto -h <url> -Format json -output /tmp/workspace/nikto.json
        """
        cmd = f"nikto -h {target} -Format json -output /tmp/workspace/nikto.json"
        exit_code, stdout = self.exec_in_container(cmd, timeout_s=180.0)
        artifact = self.read_artifact_from_container("/tmp/workspace/nikto.json")
        return exit_code, artifact or stdout

    # --------------------------------------------------------------------------
    # SAST Scanner Executions
    # --------------------------------------------------------------------------

    def clone_repository(self, repo_url: str) -> Tuple[int, str]:
        """Shallow-clones a public repository into ephemeral container workspace."""
        cmd = f"rm -rf /tmp/workspace/repo && git clone --depth 1 {repo_url} /tmp/workspace/repo"
        return self.exec_in_container(cmd, timeout_s=120.0)

    def run_semgrep(self) -> Tuple[int, str]:
        """Executes Semgrep code analysis on the cloned repository."""
        cmd = "semgrep --config auto --json -o /tmp/workspace/semgrep.json /tmp/workspace/repo"
        exit_code, stdout = self.exec_in_container(cmd, timeout_s=180.0)
        artifact = self.read_artifact_from_container("/tmp/workspace/semgrep.json")
        return exit_code, artifact or stdout

    def run_gitleaks(self) -> Tuple[int, str]:
        """Executes Gitleaks secret detection on the cloned repository."""
        cmd = "gitleaks detect --source /tmp/workspace/repo --report-format json --report-path /tmp/workspace/gitleaks.json"
        exit_code, stdout = self.exec_in_container(cmd, timeout_s=120.0)
        artifact = self.read_artifact_from_container("/tmp/workspace/gitleaks.json")
        return exit_code, artifact or stdout
