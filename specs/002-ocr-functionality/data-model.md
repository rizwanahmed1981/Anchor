# Data Model: OCR Functionality for Image-Based Documents

## Entity: OCRJob
Represents a single OCR processing task with status, input file, output text, and processing metadata.

**Fields**:
- `id` (UUID/string): Unique identifier for the OCR job
- `user_id` (string): Identifier of the user who initiated the job (for authorization)
- `input_file_path` (string): Path to the uploaded image file (relative to storage root)
- `output_text_path` (string): Path to the extracted text result (if saved)
- `status` (enum: pending, processing, completed, failed, cancelled): Current state of the job
- `progress` (float, 0-100): Processing progress percentage
- `error_message` (string, nullable): Error details if job failed
- `created_at` (datetime): Timestamp when job was created
- `updated_at` (datetime): Timestamp when job was last updated
- `completed_at` (datetime, nullable): Timestamp when job was completed
- `file_format` (string): Original file format (jpeg, png, pdf, etc.)
- `file_size` (integer): Size of the uploaded file in bytes
- `page_count` (integer): Number of pages if multi-page document
- `language_code` (string): Language used for OCR processing (e.g., 'eng')

**Validation Rules**:
- `user_id` must exist and be valid
- `input_file_path` must point to an existing file
- `status` must be one of the defined enum values
- `progress` must be between 0 and 100
- `file_size` must be positive and within limits (≤10MB)

## Entity: ExtractedText
The resulting text content from OCR processing, including character positions and confidence scores.

**Fields**:
- `id` (UUID/string): Unique identifier for the extracted text record
- `ocr_job_id` (string): Reference to the OCR job that produced this text
- `raw_text` (string): The extracted text content
- `confidence_score` (float, 0-100): Overall confidence in the extraction accuracy
- `word_confidence_scores` (JSON/array): Confidence scores for individual words or segments
- `character_positions` (JSON/object): Position data for text elements (optional, for advanced features)
- `language_detected` (string): Language detected in the document (for validation)
- `processing_time_ms` (integer): Time taken for OCR processing in milliseconds
- `quality_metrics` (JSON/object): Additional quality metrics (accuracy estimates, etc.)

**Validation Rules**:
- `ocr_job_id` must reference an existing OCR job
- `raw_text` must not exceed reasonable length limits
- `confidence_score` must be between 0 and 100
- `processing_time_ms` must be non-negative

## Entity: ImageDocument
Uploaded image file with metadata (format, size, processing parameters).

**Fields**:
- `id` (UUID/string): Unique identifier for the image document
- `user_id` (string): Identifier of the user who uploaded the document
- `filename` (string): Original filename provided by user
- `stored_filename` (string): Internal filename for storage
- `file_path` (string): Relative path to stored file
- `file_format` (string): Detected file format (jpeg, png, tiff, pdf, etc.)
- `file_size_bytes` (integer): Size of the file in bytes
- `upload_timestamp` (datetime): When the file was uploaded
- `sha256_hash` (string): Hash of the file for integrity verification
- `preprocessing_params` (JSON/object): Parameters applied during image preprocessing
- `page_count` (integer): Number of pages (for multi-page formats like PDF)
- `width_px` (integer): Width of the image in pixels (for single-page images)
- `height_px` (integer): Height of the image in pixels (for single-page images)
- `deleted_at` (datetime, nullable): Timestamp if the document was deleted (soft delete)

**Validation Rules**:
- `user_id` must exist and be valid
- `file_size_bytes` must be within limits (≤10MB)
- `file_format` must be one of the supported formats
- `sha256_hash` must be properly formatted
- `width_px` and `height_px` must be positive for single-page images

## Relationships
- `OCRJob` belongs to a `User` (via `user_id`)
- `OCRJob` references an `ImageDocument` (via `input_file_path`)
- `ExtractedText` belongs to an `OCRJob` (via `ocr_job_id`)
- `OCRJob` has one `ExtractedText` (one-to-one relationship)

## Indexes
- `OCRJob.user_id` for efficient user-based queries
- `OCRJob.status` for efficient status-based queries
- `ImageDocument.user_id` for efficient user-based queries
- `ImageDocument.upload_timestamp` for efficient chronological queries
- `OCRJob.created_at` for efficient chronological queries