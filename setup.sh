# export MOD_AGREEMENTS_URL=http://localhost:9130/erm

AUTH_TOKEN=`./okapi-login`

OKAPI="http://localhost:9130"
TENANT="diku"

if [ -f .okapirc ]; then
  . .okapirc
elif [ -f $HOME/.okapirc ]; then
  . $HOME/.okapirc
fi

echo "Submit query with auth ${AUTH_TOKEN}"

# curl -X POST http://localhost:4001 \
#          -H "X-Okapi-Tenant: ${TENANT}" \
#          -H "X-Okapi-Token: ${AUTH_TOKEN}" \
#          -H "Content-Type: application/json" \
#          -d '{"query" : "{ agreements { name description } }" }'

# curl -X POST http://localhost:4001 -H "Content-Type: application/json" -H "X-Okapi-Tenant: diku" -H "X-Okapi-Token: 124" -d '{"query" : "{ agreements { name description } }" }'

echo "call a:${AUTH_TOKEN}"

curl -v --trace-ascii t -trace-time -X POST http://localhost:4001 \
     -H "Content-Type: application/json" \
     -H "X-Okapi-Tenant: $TENANT" \
     -H "X-Okapi-Token: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkaWt1X2FkbWluIiwidXNlcl9pZCI6Ijg1YTZkYmZiLTkxNzctNTc5Ny1iMDk0LTEwYTcxNDExMDc2MCIsImlhdCI6MTYxMjU0MzYzOSwidGVuYW50IjoiZGlrdSJ9.cLEzAgPfVCY1sWo2sjWhEbVxuKKOT6YU1qr_qFoz9pc" \
     -d '{"query" : "{ agreements { name description } }" }'

echo completed.

# R1=`curl -H "X-Okapi-Tenant: ${TENANT}" \
#          -H "X-Okapi-Token: ${AUTH_TOKEN}" \
#          -H "Content-Type: application/json" -X POST http://localhost:4001 -d ' {
#   agreements {
#     name
#     description
#   }
# }
# '`
# echo result: $R1
