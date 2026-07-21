import requests

TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjY4NDg2NTE4NSwiYWFpIjoxMSwidWlkIjoxMTA0NzI4OTYsImlhZCI6IjIwMjYtMDctMjFUMDg6NTY6NDYuMDAwWiIsInBlciI6Im1lOndyaXRlIiwiYWN0aWQiOjM2MTMxNTQzLCJyZ24iOiJhcHNlMiJ9.j2jwsSNQdKSFoP2PfzyHWftXofqwAtCgvoC-Q1u0puk"

query = """
query {
  me {
    id
    name
  }
}
"""

response = requests.post(
    "https://api.monday.com/v2",
    json={"query": query},
    headers={
        "Authorization": TOKEN,
        "Content-Type": "application/json",
    },
)

print(response.status_code)
print(response.text)