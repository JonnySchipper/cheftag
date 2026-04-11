#!/bin/bash

# Ticketer Label Printing System - Startup Script

echo "========================================"
echo "  Ticketer Label Printing System"
echo "========================================"
echo ""
echo "Choose an option:"
echo ""
echo "1. Start Print Server (Mock Mode)"
echo "2. Start Web Interface"
echo "3. Start Both"
echo "4. Install Dependencies"
echo "5. Exit"
echo ""

read -p "Enter choice (1-5): " choice

case $choice in
    1)
        echo "Starting Print Server..."
        cd print-server
        python3 server.py
        ;;
    2)
        echo "Starting Web Interface..."
        cd web
        python3 -m http.server 8000
        ;;
    3)
        echo "Starting both servers..."
        echo ""
        echo "Print Server will run in background..."
        echo "Web Interface will start..."
        echo ""
        cd print-server
        python3 server.py &
        SERVER_PID=$!
        cd ../web
        python3 -m http.server 8000 &
        WEB_PID=$!
        
        echo "Print Server PID: $SERVER_PID"
        echo "Web Server PID: $WEB_PID"
        echo ""
        echo "Press Ctrl+C to stop both servers"
        
        # Wait for interrupt
        trap "kill $SERVER_PID $WEB_PID 2>/dev/null; exit" INT
        wait
        ;;
    4)
        echo "Installing dependencies..."
        cd print-server
        pip3 install -r requirements.txt
        echo "Dependencies installed successfully!"
        ;;
    5)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac