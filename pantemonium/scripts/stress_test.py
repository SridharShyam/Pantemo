import asyncio
import httpx
import time
import statistics
import sys

BASE_URL = "http://localhost:8000/api/v1/"

async def stress_scan(client, task_id):
    """Simulates a high-fidelity garment scan request."""
    start = time.perf_counter()
    try:
        # relative path without leading slash
        response = await client.post(
            "garments/scan", 
            params={"category": "outerwear", "image_b64": "dummy_high_res_data_string_for_stress_test"}
        )
        end = time.perf_counter()
        return end - start, response.status_code
    except Exception as e:
        end = time.perf_counter()
        return end - start, 500

async def run_stress_test(num_concurrent=50):
    print(f"INITIATING PANTEMONIUM PRO STRESS TEST...")
    print(f"Target: {BASE_URL}/garments/scan")
    print(f"Concurrency Level: {num_concurrent}")
    print("-" * 50)

    async with httpx.AsyncClient(base_url=BASE_URL, timeout=60.0) as client:
        start_time = time.perf_counter()
        
        # Run concurrent tasks
        tasks = [stress_scan(client, i) for i in range(num_concurrent)]
        results = await asyncio.gather(*tasks)
        
        total_time = time.perf_counter() - start_time
        
        times = [r[0] for r in results]
        statuses = [r[1] for r in results]
        
        success_count = statuses.count(200)
        failure_count = len(statuses) - success_count
        
        avg_rt = statistics.mean(times)
        min_rt = min(times)
        max_rt = max(times)
        try:
            p95_rt = statistics.quantiles(times, n=20)[18] 
        except:
            p95_rt = max_rt

        print("\nPERFORMANCE SUMMARY:")
        print(f"Successful Scans: {success_count}")
        print(f"Failed Scans:     {failure_count}")
        print(f"Total Duration:   {total_time:.3f}s")
        print(f"Throughput:       {len(results)/total_time:.2f} req/s")
        print("-" * 50)
        print(f"Latency Profile:")
        print(f"   Avg: {avg_rt:.3f}s")
        print(f"   Min: {min_rt:.3f}s")
        print(f"   P95: {p95_rt:.3f}s")
        print(f"   Max: {max_rt:.3f}s")
        
        if success_count == len(results) and p95_rt < 0.5:
            print("\nRESULT: ENTERPRISE READY (EXCELLENT)")
        elif success_count == len(results):
            print("\nRESULT: STABLE (GOOD)")
        else:
            print("\nRESULT: UNSTABLE (NEEDS SCALING)")

if __name__ == "__main__":
    # Allow passing concurrency via cmd line
    concurrency = 50
    if len(sys.argv) > 1:
        concurrency = int(sys.argv[1])
        
    asyncio.run(run_stress_test(concurrency))
