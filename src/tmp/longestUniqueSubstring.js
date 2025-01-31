function longestUniqueSubstring(s) {
    let charIndex = new Map();
    let left = 0;
    let maxLength = 0;

    for (let right = 0; right < s.length; right++) {
        if (charIndex.has(s[right]) && charIndex.get(s[right]) >= left) {
            left = charIndex.get(s[right]) + 1;
        }
        charIndex.set(s[right], right);
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}

// Test cases
console.log(longestUniqueSubstring("abcabcdd"));
console.log(longestUniqueSubstring("bbbbabvdafsge"));