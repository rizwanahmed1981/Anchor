# Quickstart Guide: OCR Functionality for Image-Based Documents

## Overview
This guide explains how to set up and use the OCR functionality for converting image-based documents to text within the password manager application.

## Prerequisites
- Python 3.14 installed
- UV package manager installed
- Tesseract OCR engine installed on the system
- OpenCV library available

## Installation
1. Install Tesseract OCR:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install tesseract-ocr

   # macOS
   brew install tesseract

   # Windows (using Chocolatey)
   choco install tesseract-ocr
   ```

2. Install required Python packages:
   ```bash
   uv pip install pytesseract opencv-python-headless pillow
   ```

3. Ensure your backend is running:
   ```bash
   cd phase2-3/backend
   uv run uvicorn main:app --reload
   ```

## API Endpoints

### Upload and Process Image
```
POST /api/{user_id}/ocr/process
```
Upload an image file for OCR processing.

**Request**:
- Headers: Authorization token
- Form Data: `file` (image file, max 10MB)
- Optional Query Params: `language` (default: eng)

**Response**:
```json
{
  "job_id": "uuid-string",
  "status": "processing",
  "estimated_completion": "ISO datetime"
}
```

### Check Processing Status
```
GET /api/{user_id}/ocr/status/{job_id}
```
Check the status of an OCR job.

**Response**:
```json
{
  "job_id": "uuid-string",
  "status": "completed",
  "progress": 100,
  "result_available": true
}
```

### Get Extracted Text
```
GET /api/{user_id}/ocr/result/{job_id}
```
Retrieve the extracted text from a completed OCR job.

**Response**:
```json
{
  "text": "extracted text content...",
  "confidence_score": 95.5,
  "language_detected": "eng",
  "processing_time_ms": 1250
}
```

### Export Result
```
POST /api/{user_id}/ocr/export/{job_id}
Content-Type: application/json
```
Export the extracted text in a specific format.

**Request Body**:
```json
{
  "format": "txt|docx|pdf"
}
```

**Response**:
- Binary file content in requested format

## Usage Examples

### Using curl
```bash
# Upload an image for OCR
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@document.jpg" \
  -F "language=eng" \
  http://localhost:8000/api/user123/ocr/process

# Check status
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/user123/ocr/status/job456

# Get result
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/user123/ocr/result/job456
```

## Error Handling
- `400 Bad Request`: Invalid file format or size exceeded
- `401 Unauthorized`: Invalid or missing authentication token
- `403 Forbidden`: User doesn't have permission to access this resource
- `404 Not Found`: OCR job with specified ID doesn't exist
- `422 Unprocessable Entity`: File validation failed
- `500 Internal Server Error`: Processing error occurred

## Supported Formats
- Input: JPEG, PNG, TIFF, PDF (up to 10MB)
- Output: Plain text, DOCX, PDF

## Security Considerations
- All OCR jobs are associated with a specific user ID
- Files are validated for security before processing
- Temporary files are automatically cleaned up
- Results are only accessible by the initiating user