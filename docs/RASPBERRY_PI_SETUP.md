# Raspberry Pi Print Server Setup Guide

## Prerequisites
- Raspberry Pi (3B+ or newer recommended)
- SD Card (16GB+)
- Power supply
- Label printer (USB or network)
- Ethernet cable or WiFi connection

## Step 1: Install Raspberry Pi OS

### Option A: Using Raspberry Pi Imager (Recommended)
1. Download [Raspberry Pi Imager](https://www.raspberrypi.com/software/)
2. Insert SD card into your computer
3. Open Imager and choose:
   - **OS**: Raspberry Pi OS (64-bit) Lite (headless) or Desktop
   - **Storage**: Your SD card
4. Click the gear icon (⚙️) to configure:
   - Set hostname: `ticketer-pi`
   - Enable SSH
   - Set username/password
   - Configure WiFi (if using wireless)
5. Click "Write" and wait for completion

### Option B: Manual Installation
```bash
# Download Raspberry Pi OS Lite
wget https://downloads.raspberrypi.org/raspios_lite_arm64/images/...

# Write to SD card (replace /dev/sdX with your SD card)
sudo dd if=raspios.img of=/dev/sdX bs=4M status=progress

# Enable SSH
touch /Volumes/boot/ssh

# Configure WiFi (optional)
nano /Volumes/boot/wpa_supplicant.conf
```

## Step 2: Initial Setup

### Connect to your Pi
```bash
# Find your Pi's IP address (if using WiFi/Ethernet)
ping ticketer-pi.local

# SSH into your Pi
ssh pi@ticketer-pi.local
# or
ssh pi@<pi-ip-address>
```

### Update System
```bash
# Update package lists
sudo apt update
sudo apt upgrade -y

# Install essential tools
sudo apt install -y git curl wget vim python3-pip python3-venv
```

## Step 3: Install CUPS (Printing System)

```bash
# Install CUPS
sudo apt install -y cups cups-client cups-bsd

# Add your user to lpadmin group
sudo usermod -a -G lpadmin $USER

# Allow remote administration
sudo cupsctl --remote-any

# Restart CUPS
sudo systemctl restart cups

# Enable CUPS to start on boot
sudo systemctl enable cups
```

### Access CUPS Web Interface
1. Open browser on your computer
2. Navigate to: `http://<pi-ip-address>:631`
3. Log in with your Pi credentials
4. Go to Administration → Add Printer

## Step 4: Connect Your Printer

### USB Printer
1. Connect printer via USB to Pi
2. In CUPS web interface:
   - Click "Add Printer"
   - Select your USB printer
   - Choose appropriate driver
   - Or use "Generic Text-Only Printer" for basic support

### Network Printer
1. Ensure printer is on same network
2. In CUPS:
   - Click "Add Printer"
   - Select "Internet Printing Protocol (ipp)"
   - Enter printer IP: `ipp://<printer-ip>/ipp/print`
   - Or use `socket://<printer-ip>:9100` for raw socket

### Test Printing
```bash
# Test with a simple text file
echo "Test print from Raspberry Pi" > test.txt
lp test.txt

# Check print queue
lpstat -t

# Cancel all jobs if needed
cancel -a
```

## Step 5: Install Ticketer Print Server

### Clone the Repository
```bash
cd ~
git clone <repository-url> ticketer
cd ticketer/print-server
```

### Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

### Configure Environment
```bash
# Create environment file
nano .env

# Add these lines (adjust as needed):
FLASK_ENV=production
FLASK_DEBUG=0
PRINTER_TYPE=usb  # or 'network'
PRINTER_MODEL=generic
PRINTER_CONNECTION=/dev/usb/lp0  # or network address
```

## Step 6: Configure System Service

### Create Systemd Service File
```bash
sudo nano /etc/systemd/system/ticketer.service
```

Add the following:
```ini
[Unit]
Description=Ticketer Print Server
After=network.target cups.service
Wants=cups.service

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/ticketer/print-server
Environment="PATH=/home/pi/ticketer/print-server/venv/bin"
ExecStart=/home/pi/ticketer/print-server/venv/bin/python server.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Enable and Start Service
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service to start on boot
sudo systemctl enable ticketer.service

# Start service
sudo systemctl start ticketer.service

# Check status
sudo systemctl status ticketer.service

# View logs
sudo journalctl -u ticketer.service -f
```

## Step 7: Configure Firewall (Optional)

```bash
# Allow incoming connections on port 5000
sudo ufw allow 5000/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

## Step 8: Web Interface Setup

### On Your Development Machine
1. Open the `ticketer/web` folder
2. Edit `script.js` to point to your Pi:
```javascript
const config = {
    apiUrl: 'http://<pi-ip-address>:5000/api',
    // ... rest of config
};
```

3. Serve the web files:
   - Use any web server (nginx, Apache, Python HTTP server)
   - Or open `index.html` directly in browser

### Simple Python HTTP Server
```bash
cd ticketer/web
python3 -m http.server 8000
```
Then access: `http://localhost:8000`

## Step 9: Real Printer Integration

### Using python-escpos (Thermal Printers)
Modify `server.py` to use real printer:

```python
from escpos.printer import Usb, Serial, Network

# USB Printer
printer = Usb(0x04b8, 0x0202)  # Vendor/Product IDs

# Serial Printer
printer = Serial(devfile='/dev/ttyUSB0', baudrate=9600)

# Network Printer
printer = Network("192.168.1.100")

# Print commands
printer.text("Hello World\n")
printer.barcode('123456789012', 'EAN13')
printer.cut()
```

### Find USB Printer Details
```bash
# List USB devices
lsusb

# Example output:
# Bus 001 Device 004: ID 04b8:0202 Seiko Epson Corp. 
# Vendor ID: 04b8, Product ID: 0202
```

## Step 10: Testing & Troubleshooting

### Test API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Submit test print job
curl -X POST http://localhost:5000/api/print \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Hello World","type":"test"}'

# Check queue
curl http://localhost:5000/api/queue
```

### Common Issues & Solutions

1. **Printer not detected**
   ```bash
   # Check USB connection
   lsusb
   
   # Check printer devices
   ls -la /dev/usb/
   ls -la /dev/tty*
   
   # Add user to dialout group for serial
   sudo usermod -a -G dialout $USER
   ```

2. **CUPS permission issues**
   ```bash
   # Reset CUPS permissions
   sudo cupsctl --remote-admin --remote-any
   sudo systemctl restart cups
   ```

3. **Service won't start**
   ```bash
   # Check logs
   sudo journalctl -u ticketer.service -n 50
   
   # Test manually
   cd /home/pi/ticketer/print-server
   source venv/bin/activate
   python server.py
   ```

4. **Network connectivity**
   ```bash
   # Check Pi IP
   hostname -I
   
   # Test from another machine
   ping <pi-ip-address>
   curl http://<pi-ip-address>:5000/api/health
   ```

## Step 11: Advanced Configuration

### Auto-start Web Interface
```bash
# Install nginx
sudo apt install -y nginx

# Configure nginx
sudo nano /etc/nginx/sites-available/ticketer

# Add configuration
server {
    listen 80;
    server_name ticketer-pi.local;
    
    location / {
        root /home/pi/ticketer/web;
        index index.html;
        try_files $uri $uri/ =404;
    }
    
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/ticketer /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL/HTTPS (Optional)
```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d ticketer-pi.local
```

## Step 12: Maintenance

### Update Ticketer
```bash
cd ~/ticketer
git pull origin main
cd print-server
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart ticketer.service
```

### Backup Configuration
```bash
# Backup important files
tar -czf ticketer-backup-$(date +%Y%m%d).tar.gz \
  ~/ticketer/print-server/ \
  /etc/cups/ \
  /etc/systemd/system/ticketer.service
```

### Monitor Resources
```bash
# Check disk space
df -h

# Check memory
free -h

# Check service status
sudo systemctl status ticketer.service cups.service

# View recent print jobs
tail -f /var/log/cups/error_log
```

## Support
- Check logs: `sudo journalctl -u ticketer.service -f`
- CUPS admin: `http://<pi-ip>:631`
- API docs: `http://<pi-ip>:5000/api/health`

Your Ticketer print server is now ready! The web interface can send print jobs to your Raspberry Pi, which will forward them to your connected printer.