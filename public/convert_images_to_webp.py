from PIL import Image
import os
import shutil
import concurrent.futures
from pathlib import Path
import time


def convert_to_webp(input_image_path, output_image_path, quality=80):
    """Convert image to webp format"""
    try:
        with Image.open(input_image_path) as img:
            # Convert RGBA to RGB if necessary for better WebP compatibility
            if img.mode == "RGBA":
                img = img.convert("RGB")

            img.save(output_image_path, format="WEBP", quality=quality, method=6)

        # Verify the output file was created and has reasonable size
        if os.path.exists(output_image_path) and os.path.getsize(output_image_path) > 0:
            return True, f"Successfully converted {input_image_path}"
        else:
            return False, f"Failed to create valid WebP for {input_image_path}"

    except Exception as e:
        return False, f"Error converting {input_image_path}: {e}"


def move_to_backup(input_image_path, backup_folder):
    """Move original image to backup folder"""
    try:
        backup_folder.mkdir(exist_ok=True)
        backup_path = backup_folder / Path(input_image_path).name
        shutil.move(str(input_image_path), str(backup_path))
        return True, f"Moved {input_image_path} to backup"
    except Exception as e:
        return False, f"Error moving {input_image_path} to backup: {e}"


def process_image(args):
    """Process a single image file"""
    input_path, output_path, backup_folder, quality = args

    # Convert to WebP
    success, conv_msg = convert_to_webp(input_path, output_path, quality)

    if success:
        # Only move to backup if conversion was successful
        backup_success, backup_msg = move_to_backup(input_path, backup_folder)
        if backup_success:
            return True, f"✓ {input_path.name} -> WebP"
        else:
            # If backup failed, remove the webp file to avoid orphans
            try:
                os.remove(output_path)
            except:
                pass
            return False, f"✗ {input_path.name}: Conversion OK but backup failed - {backup_msg}"
    else:
        return False, f"✗ {input_path.name}: {conv_msg}"


def batch_convert_images(input_dir, quality=80, max_workers=None):
    """Batch convert images with improved performance and error handling"""
    input_path = Path(input_dir)

    if not input_path.exists():
        print(f"Error: Directory {input_dir} does not exist")
        return

    # Supported formats
    supported_formats = {".jpg", ".jpeg", ".png", ".avif", ".bmp", ".tiff", ".tif"}

    # Find all image files first (more efficient filtering)
    image_files = [f for f in input_path.iterdir() if f.is_file() and f.suffix.lower() in supported_formats]

    if not image_files:
        print("No supported image files found")
        return

    print(f"Found {len(image_files)} image files to process")

    backup_folder = input_path / "BACKUP"

    # Prepare arguments for multiprocessing
    process_args = []
    for input_file in image_files:
        output_file = input_file.with_suffix(".webp")
        # Skip if WebP already exists
        if output_file.exists():
            print(f"⚠ Skipping {input_file.name} - WebP already exists")
            continue
        process_args.append((input_file, output_file, backup_folder, quality))

    if not process_args:
        print("No files to process (all WebP versions already exist)")
        return

    # Use optimal number of workers (don't overwhelm system)
    if max_workers is None:
        max_workers = min(len(process_args), os.cpu_count() or 1)

    print(f"Processing {len(process_args)} files using {max_workers} workers...")

    start_time = time.time()
    successful = 0
    failed = 0

    # Process images in parallel
    with concurrent.futures.ProcessPoolExecutor(max_workers=max_workers) as executor:
        results = executor.map(process_image, process_args)

        for success, message in results:
            print(message)
            if success:
                successful += 1
            else:
                failed += 1

    end_time = time.time()

    print(f"\n--- Summary ---")
    print(f"Processed: {successful + failed} files")
    print(f"Successful: {successful}")
    print(f"Failed: {failed}")
    print(f"Time taken: {end_time - start_time:.2f} seconds")

    if successful > 0:
        print(f"Average time per file: {(end_time - start_time) / (successful + failed):.2f} seconds")


# Example Usage
if __name__ == "__main__":
    input_directory = "./shoes"

    # Convert with high quality and controlled concurrency
    batch_convert_images(input_directory, quality=85, max_workers=4)
