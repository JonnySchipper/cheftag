# Ticketer - Quick Start Guide

## Get Started in 10 Minutes

### Option 1: Local Development (No Raspberry Pi Needed)

1. **Start the Print Server (Mock Mode)**
   ```bash
   cd print-server
   python server.py
   ```
   Server starts at: http://localhost:5000

2. **Open the Web Interface**
   - Open `web/index.html` in your browser
   - Or run: `cd web && python -m http.server 8000`
   - Then visit: http://localhost:8000

3. **Test Printing**
   - Fill in the label form
   - Click "Preview" to see how it looks
   - Click "Print Label" to submit to queue
   - Watch the queue update in real-time

### Option 2: With Raspberry Pi

1. **Follow the Raspberry Pi Setup Guide**
   See: `docs/RASPBERRY_PI_SETUP.md`

2. **Update Web Interface Configuration**
   In `web/script.js`, change:
   ```javascript
   const config = {
       apiUrl: 'http://<YOUR_PI_IP>:5000/api',
       // ...
   };
   ```

3. **Access from Any Device**
   - Put web files on a web server
   - Or use Python: `cd web && python -m http.server 8000`
   - Access from phone/tablet: `http://<SERVER_IP>:8000`

## Features You Can Test Immediately

### 1. Label Creation
- Multiple label types (Shipping, Barcode, Ticket, etc.)
- Custom title and content
- Quantity selection (1-100)
- Priority levels (Low to Urgent)

### 2. Print Queue
- Real-time queue updates
- Job status tracking (Queued → Printing → Completed)
- Priority-based processing
- Clear individual jobs or entire queue

### 3. Preview System
- See exactly how label will look
- Toggle barcode/timestamp options
- Print directly from preview

### 4. System Monitoring
- Server connection status
- Printer status
- Queue count
- Last print time

## Next Steps After Testing

### 1. Connect Real Printer
- Follow Raspberry Pi setup guide
- Configure CUPS or direct USB connection
- Test with `lp` command first

### 2. Customize for Your Needs
- Modify label templates in `web/index.html`
- Adjust print server settings in `print-server/server.py`
- Add your logo/branding to CSS

### 3. Deploy for Production
- Set up proper web server (nginx/Apache)
- Configure SSL/HTTPS
- Set up automatic backups
- Implement user authentication if needed

## Troubleshooting Common Issues

### Web Interface Can't Connect
```javascript
// Check config in web/script.js
const config = {
    apiUrl: 'http://localhost:5000/api',  // Change to your server IP
};
```

### Print Server Won't Start
```bash
# Check Python version
python --version  # Should be 3.8+

# Install dependencies
pip install -r requirements.txt

# Check port 5000 isn't in use
netstat -an | grep 5000
```

### Mock Printer Works, Real Printer Doesn't
1. Check printer connection (USB/Network)
2. Verify CUPS configuration on Raspberry Pi
3. Test with simple command: `echo "test" | lp`
4. Check printer vendor/product IDs for python-escpos

## Ready for Production?

### Security Checklist
- [ ] Change default passwords
- [ ] Enable HTTPS
- [ ] Configure firewall
- [ ] Regular updates
- [ ] Backup configuration

### Performance Checklist
- [ ] Test with 100+ labels
- [ ] Monitor memory usage
- [ ] Optimize database queries
- [ ] Implement caching if needed

## Need Help?
- Check `docs/` folder for detailed guides
- Review code comments for configuration options
- Test with mock printer first before hardware

## Quick Commands Reference

```bash
# Start mock server
cd print-server && python server.py

# Start web server
cd web && python -m http.server 8000

# Test API
curl http://localhost:5000/api/health
curl -X POST http://localhost:5000/api/print -H "Content-Type: application/json" -d '{"title":"Test","content":"Hello","type":"test"}'

# Check queue
curl http://localhost:5000/api/queue
```

Your Ticketer system is now ready! Start with the mock printer to understand the workflow, then connect your real hardware when ready.