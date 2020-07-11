run: fmt
	echo "Running Mod.js..."
	deno run -A mod.js

test: fmt
	deno test

serve:
	deno run --allow-net --allow-read https://deno.land/std/http/file_server.ts

fmt:
	deno fmt -q
