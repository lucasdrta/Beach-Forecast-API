docker build \
  -t beach-forecast

docker run \
  --name beach-forecast \
  -p 3000:3000 \
  -e MONGODB_URL=mongodb://mongodb/surf-forecast \
  -e APP_PORT=3000 \
  -e STORM_GLASS_API_URL=https://api.stormglass.io/v2 \
  -e STORM_GLASS_API_TOKEN=Some-Token \
  --link mongodb \
  -d \
  beach-forecast
