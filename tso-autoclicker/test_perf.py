import cv2
import numpy as np
import time

def test_dedup_performance():
    print("Testing dedup performance on a uniform haystack...")
    
    # Create a 1920x1080 uniform grayscale image
    haystack = np.ones((1080, 1920), dtype=np.uint8) * 128
    
    # Create a 20x20 uniform grayscale needle
    needle = np.ones((20, 20), dtype=np.uint8) * 128
    
    h, w = needle.shape
    
    start = time.time()
    res = cv2.matchTemplate(haystack, needle, cv2.TM_CCOEFF_NORMED)
    print(f"matchTemplate took {time.time() - start:.3f} seconds")
    
    # In uniform areas, TM_CCOEFF_NORMED can behave weirdly due to zero variance, 
    # but let's assume it returned many 1.0s or just simulate the `loc`
    
    # Simulate 20,000 matches (typical for matching a dummy on a UI background)
    num_matches = 20000
    pts = np.random.randint(0, 1000, size=(num_matches, 2))
    
    points = []
    start = time.time()
    print(f"Starting deduplication of {num_matches} points...")
    for i, pt in enumerate(pts):
        center_x = pt[0]
        center_y = pt[1]
        if not any(abs(center_x - p[0]) < 20 and abs(center_y - p[1]) < 20 for p in points):
            points.append((center_x, center_y))
        
        if i % 5000 == 0 and i > 0:
            print(f"Processed {i} points in {time.time() - start:.3f} sec. Current unique points: {len(points)}")
            
    print(f"Deduplication took {time.time() - start:.3f} seconds. Unique points: {len(points)}")

if __name__ == "__main__":
    test_dedup_performance()
