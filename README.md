# Ticketer - Label Printing System

## Project Description
A web-based system for generating and printing labels/tickets via a Raspberry Pi print server.

## Quick Start

### Prerequisites
- Node.js 16+ or Python 3.8+
- Raspberry Pi with Raspberry Pi OS
- Label printer (thermal, barcode, etc.)

### Installation
```bash
# Web Interface
cd web
npm install
npm start

# Print Server (Raspberry Pi)
cd print-server
pip install -r requirements.txt
python server.py
```

## Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Interface │────│  Print Server   │────│     Printer     │
│   (Browser)     │    │  (Raspberry Pi) │    │  (USB/Network)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Features
- Web-based label design
- Real-time print queue
- Multiple printer support
- Label template management
- Print job history

## Development
See `DEVELOPMENT.md` for detailed setup instructions and coding guidelines.