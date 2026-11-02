with open('locales/en/local/09.md') as f:
    text = f.read()

print("Verified:", text.count("- Reliability: verified"))
print("Unverified:", text.count("- Reliability: unverified"))
