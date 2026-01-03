import os
import subprocess
import sys
import time
import signal

def get_python_executable():
    """Detects and returns the best python executable (venv or system)."""
    venv_path = os.path.join(os.getcwd(), "venv")
    if os.path.exists(venv_path):
        # Determine OS specific path
        if sys.platform == "win32":
            exec_path = os.path.join(venv_path, "Scripts", "python.exe")
        else:
            exec_path = os.path.join(venv_path, "bin", "python3")
            
        if os.path.exists(exec_path):
            return exec_path
    return sys.executable

def run_command(command, cwd=None, env=None):
    """Runs a command and returns the process."""
    # Merge provided env with system env
    process_env = os.environ.copy()
    if env:
        process_env.update(env)

    return subprocess.Popen(
        command,
        shell=True,
        cwd=cwd,
        env=process_env,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1,
        universal_newlines=True,
        encoding='utf-8',
        errors='replace'
    )

def main():
    print("🚀 Initializing The Mentalist PRO...")
    
    python_exec = get_python_executable()
    print(f"🐍 Using Python: {python_exec}")

    # 1. Setup Backend
    print("📦 Verifying Backend Dependencies...")
    try:
        # Try to install within the detected python environment
        subprocess.check_call([python_exec, "-m", "pip", "install", "-r", "requirements.txt"])
    except Exception as e:
        print(f"⚠️ Warning: Dependency check skipped or failed (common in system-managed envs).")
        print(f"   If you haven't installed dependencies, please run: source venv/bin/activate && pip install -r requirements.txt")

    # 2. Setup Frontend
    print("⚛️ Verifying Frontend Dependencies...")
    frontend_dir = os.path.join(os.getcwd(), "frontend")
    if not os.path.exists(os.path.join(frontend_dir, "node_modules")):
        print("📦 node_modules not found. Running npm install...")
        try:
            subprocess.check_call(["npm", "install"], cwd=frontend_dir)
        except Exception as e:
            print(f"❌ Failed to install frontend dependencies: {e}")
            sys.exit(1)

    # 3. Start Processes
    processes = []
    try:
        print("📡 Starting FastAPI Backend (Port 8000)...")
        # Force UTF-8 encoding for backend to handle emojis/unicode correctly on Windows
        backend_env = {"PYTHONIOENCODING": "utf-8"}
        backend_proc = run_command(
            f"{python_exec} -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload", 
            env=backend_env
        )
        processes.append(backend_proc)

        print("💻 Starting Vite Frontend (Port 5173)...")
        frontend_proc = run_command("npm run dev", cwd=frontend_dir)
        processes.append(frontend_proc)

        print("\n✅ All systems active!")
        print("🔗 Frontend: http://localhost:5173")
        print("🔗 Backend API: http://localhost:8000")
        print("\nPress Ctrl+C to shutdown.\n")

        # Pipe output from backend and frontend for visibility
        import threading

        def stream_output(process, label):
            for line in iter(process.stdout.readline, ''):
                if line:
                    print(f"[{label}] {line.strip()}")

        # Start threads to stream output
        threading.Thread(target=stream_output, args=(backend_proc, "BACKEND"), daemon=True).start()
        threading.Thread(target=stream_output, args=(frontend_proc, "FRONTEND"), daemon=True).start()

        while True:
            time.sleep(1)
            # Check if any process has died
            if backend_proc.poll() is not None:
                print("❌ Backend process terminated unexpectedly.")
                break
            if frontend_proc.poll() is not None:
                print("❌ Frontend process terminated unexpectedly.")
                break
            
    except KeyboardInterrupt:
        print("\n🛑 Shutting down AI-Profiler...")
    finally:
        for p in processes:
            p.terminate()
            p.wait()
        print("👋 Goodbye!")

if __name__ == "__main__":
    main()
