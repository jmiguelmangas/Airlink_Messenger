
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

app = FastAPI()

# Lista para mantener todas las conexiones activas
active_connections = []

@app.websocket("/wschat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Enviar el mensaje a todos los clientes conectados
            for connection in active_connections:
                await connection.send_text(f"Message: {data}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        active_connections.remove(websocket)
        await websocket.close()

# Servir archivos estáticos
app.mount("/html", StaticFiles(directory="html"), name="html")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
