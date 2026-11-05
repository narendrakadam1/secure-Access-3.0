# ==============================================================================
# SECUREASSESS - Backend & Lightweight Security Scanner Service
# Multi-tool DAST/SAST toolchain (Nikto, Nmap, Semgrep, Gitleaks) +
# Python 3.11 FastAPI Orchestrator + WeasyPrint PDF Renderer
# Optimized for high stability, fast builds (<2 min), and low RAM (<250 MB)
# ==============================================================================

FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# 1. Install system utilities, WeasyPrint PDF native libraries, and lightweight DAST tools (Nikto, Nmap)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    wget \
    git \
    jq \
    build-essential \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    libharfbuzz0b \
    libjpeg-dev \
    libopenjp2-7-dev \
    libffi-dev \
    nikto \
    nmap \
    && rm -rf /var/lib/apt/lists/*

# 2. Install Gitleaks (Secrets detection standalone binary)
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then GITLEAKS_ARCH="x64"; elif [ "$ARCH" = "aarch64" ]; then GITLEAKS_ARCH="arm64"; else GITLEAKS_ARCH="x64"; fi && \
    curl -sSL "https://github.com/gitleaks/gitleaks/releases/download/v8.18.2/gitleaks_8.18.2_linux_${GITLEAKS_ARCH}.tar.gz" -o /tmp/gitleaks.tar.gz && \
    tar -xzf /tmp/gitleaks.tar.gz -C /usr/local/bin gitleaks && \
    chmod +x /usr/local/bin/gitleaks && \
    rm -f /tmp/gitleaks.tar.gz || true

# 3. Install Semgrep (SAST static analysis)
RUN pip install --no-cache-dir semgrep || true

# 4. Install Python backend dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy backend source code
COPY . .

# 6. Initialize workspace and artifacts directories
RUN mkdir -p /app/data /tmp/workspace /tmp/artifacts && chmod -R 777 /tmp/workspace /tmp/artifacts

EXPOSE 8000

# 7. Start FastAPI binding dynamically to Render's $PORT (or 8000)
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
