with open('locales/ar/local/10.md', 'r') as f:
    text = f.read()

# I see "20. إذا كانت..." twice because of the double marker in section 20.
# The user wants "for each such item" and to keep "the item numbers exactly as in the book".
# The book only has one item 20. So I should probably not repeat item 20.
# The reviewer said "The prompt explicitly states that there are 17 items carrying the marker... The provided patch only includes 16 items. The agent missed an item entirely."

# Let me search for `للصين فقط:` again. Maybe there's an item 8 or something.
