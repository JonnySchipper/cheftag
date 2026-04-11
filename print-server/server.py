#!/usr/bin/env python3
"""
Ticketer Print Server
Raspberry Pi-based print server for label printing system
"""

import json
import time
import threading
import queue
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for web interface

# Global state
print_queue = queue.Queue()
print_jobs = {}
job_counter = 0
printer_status = "disconnected"
server_start_time = datetime.now()

# Mock printer class (replace with real printer driver)
class MockPrinter:
    def __init__(self):
        self.connected = False
        self.current_job = None
        
    def connect(self):
        """Simulate printer connection"""
        logger.info("Connecting to printer...")
        time.sleep(0.5)  # Simulate connection delay
        self.connected = True
        logger.info("Printer connected (mock)")
        return True
        
    def disconnect(self):
        self.connected = False
        logger.info("Printer disconnected")
        
    def print_label(self, job_data):
        """Simulate printing a label"""
        if not self.connected:
            raise Exception("Printer not connected")
            
        logger.info(f"Printing label: {job_data['title']}")
        logger.info(f"Content: {job_data['content']}")
        logger.info(f"Quantity: {job_data['quantity']}")
        
        # Simulate print time (1 second per label)
        for i in range(job_data['quantity']):
            time.sleep(1)
            logger.info(f"Printed copy {i+1}/{job_data['quantity']}")
            
        if job_data['options'].get('cutAfterPrint', True):
            logger.info("Cutting paper...")
            time.sleep(0.5)
            
        logger.info("Print job completed")
        return True

# Initialize printer
printer = MockPrinter()

def printer_worker():
    """Background worker to process print jobs"""
    global printer_status
    
    while True:
        try:
            # Get next job from queue
            job_id = print_queue.get(timeout=1)
            
            if job_id not in print_jobs:
                continue
                
            job = print_jobs[job_id]
            
            # Update job status
            job['status'] = 'printing'
            job['started_at'] = datetime.now().isoformat()
            logger.info(f"Starting print job {job_id}: {job['title']}")
            
            try:
                # Ensure printer is connected
                if not printer.connected:
                    printer.connect()
                    printer_status = "connected"
                
                # Print the label
                printer.print_label(job)
                
                # Mark job as completed
                job['status'] = 'completed'
                job['completed_at'] = datetime.now().isoformat()
                logger.info(f"Completed print job {job_id}")
                
            except Exception as e:
                # Mark job as failed
                job['status'] = 'error'
                job['error'] = str(e)
                logger.error(f"Print job {job_id} failed: {e}")
                
                # Try to reconnect printer
                printer_status = "error"
                try:
                    printer.disconnect()
                    time.sleep(2)
                    printer.connect()
                    printer_status = "connected"
                except:
                    printer_status = "disconnected"
            
            # Remove completed jobs after 5 minutes
            if job['status'] in ['completed', 'error']:
                threading.Timer(300, lambda: cleanup_job(job_id)).start()
                
            print_queue.task_done()
            
        except queue.Empty:
            continue
        except Exception as e:
            logger.error(f"Printer worker error: {e}")
            time.sleep(5)

def cleanup_job(job_id):
    """Remove old jobs from memory"""
    if job_id in print_jobs:
        del print_jobs[job_id]
        logger.info(f"Cleaned up job {job_id}")

# Start printer worker thread
worker_thread = threading.Thread(target=printer_worker, daemon=True)
worker_thread.start()

# API Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'server_uptime': str(datetime.now() - server_start_time),
        'printer_status': printer_status,
        'queue_size': print_queue.qsize(),
        'active_jobs': len([j for j in print_jobs.values() if j['status'] == 'printing']),
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/print', methods=['POST'])
def submit_print_job():
    """Submit a new print job"""
    global job_counter
    
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['title', 'content', 'type']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Generate job ID
        job_counter += 1
        job_id = f"JOB-{job_counter:06d}"
        
        # Create job object
        job = {
            'id': job_id,
            'title': data['title'],
            'content': data['content'],
            'type': data['type'],
            'quantity': data.get('quantity', 1),
            'priority': data.get('priority', 'normal'),
            'options': data.get('options', {}),
            'status': 'queued',
            'timestamp': data.get('timestamp', datetime.now().isoformat()),
            'submitted_at': datetime.now().isoformat()
        }
        
        # Store job
        print_jobs[job_id] = job
        
        # Add to queue based on priority
        print_queue.put(job_id)
        
        logger.info(f"Submitted print job {job_id}: {job['title']}")
        
        return jsonify({
            'success': True,
            'jobId': job_id,
            'message': 'Print job submitted to queue',
            'queuePosition': print_queue.qsize()
        })
        
    except Exception as e:
        logger.error(f"Error submitting print job: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/queue', methods=['GET'])
def get_queue():
    """Get current print queue"""
    try:
        # Get all jobs, sorted by submission time (newest first)
        jobs_list = list(print_jobs.values())
        jobs_list.sort(key=lambda x: x['submitted_at'], reverse=True)
        
        return jsonify({
            'queue': jobs_list,
            'total': len(jobs_list),
            'queued': len([j for j in jobs_list if j['status'] == 'queued']),
            'printing': len([j for j in jobs_list if j['status'] == 'printing']),
            'completed': len([j for j in jobs_list if j['status'] == 'completed']),
            'errors': len([j for j in jobs_list if j['status'] == 'error'])
        })
        
    except Exception as e:
        logger.error(f"Error getting queue: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/queue/<job_id>', methods=['GET'])
def get_job_status(job_id):
    """Get status of a specific job"""
    if job_id not in print_jobs:
        return jsonify({'error': 'Job not found'}), 404
    
    return jsonify(print_jobs[job_id])

@app.route('/api/queue/<job_id>', methods=['DELETE'])
def cancel_job(job_id):
    """Cancel a print job"""
    # Note: In a real implementation, we'd need to remove from queue
    # This is simplified for the mock server
    if job_id in print_jobs:
        print_jobs[job_id]['status'] = 'cancelled'
        logger.info(f"Cancelled job {job_id}")
        return jsonify({'success': True, 'message': 'Job cancelled'})
    
    return jsonify({'error': 'Job not found'}), 404

@app.route('/api/queue', methods=['DELETE'])
def clear_queue():
    """Clear all queued jobs"""
    global print_queue
    
    # Count how many jobs will be cleared
    queued_count = len([j for j in print_jobs.values() if j['status'] == 'queued'])
    
    # Create new empty queue
    print_queue = queue.Queue()
    
    # Mark all queued jobs as cancelled
    for job_id, job in print_jobs.items():
        if job['status'] == 'queued':
            job['status'] = 'cancelled'
    
    logger.info(f"Cleared print queue ({queued_count} jobs)")
    
    return jsonify({
        'success': True,
        'message': f'Cleared {queued_count} jobs from queue'
    })

@app.route('/api/printer/connect', methods=['POST'])
def connect_printer():
    """Manually connect to printer"""
    try:
        if printer.connect():
            global printer_status
            printer_status = "connected"
            return jsonify({'success': True, 'message': 'Printer connected'})
        else:
            return jsonify({'success': False, 'message': 'Failed to connect printer'}), 500
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/printer/status', methods=['GET'])
def get_printer_status():
    """Get printer status"""
    return jsonify({
        'connected': printer.connected,
        'status': printer_status,
        'current_job': printer.current_job
    })

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get server statistics"""
    jobs_by_status = {}
    for job in print_jobs.values():
        status = job['status']
        jobs_by_status[status] = jobs_by_status.get(status, 0) + 1
    
    return jsonify({
        'total_jobs_processed': job_counter,
        'jobs_by_status': jobs_by_status,
        'queue_size': print_queue.qsize(),
        'server_uptime': str(datetime.now() - server_start_time),
        'printer_status': printer_status,
        'timestamp': datetime.now().isoformat()
    })

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}")
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    logger.info("Starting Ticketer Print Server...")
    logger.info(f"Server started at {server_start_time}")
    logger.info("API endpoints available at http://localhost:5000/api/")
    logger.info("Health check: http://localhost:5000/api/health")
    
    # Try to connect printer on startup
    try:
        printer.connect()
        printer_status = "connected"
        logger.info("Printer connected successfully")
    except Exception as e:
        logger.warning(f"Could not connect printer on startup: {e}")
        printer_status = "disconnected"
    
    # Start Flask server
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)