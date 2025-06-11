# Enigma Machine Bug Fix

## Bug Description

The original Enigma machine implementation had a critical flaw in how the plugboard swaps were applied during encryption and decryption. In a real Enigma machine, the plugboard (Steckerbrett) swaps letters both at the input and output of the encryption circuit.

**Original Issue:**
- The plugboard swap was only applied at the beginning of the encryption path.
- The signal would pass through the plugboard, then through the rotors and reflector.
- However, it would not pass through the plugboard again on the return path.

This is not how the historical Enigma machine worked. In the real device, the electrical signal passes through the plugboard twice:
1. On the way in (before reaching the rotors)
2. On the way out (after the signal returns from the reflector and rotors)

## Fix Implementation

The fix is straightforward: apply the plugboard swap a second time after the signal has passed through all rotors and the reflector.

```javascript
encryptChar(c) {
  if (!alphabet.includes(c)) return c;
  this.stepRotors();
  // Apply plugboard at input
  c = plugboardSwap(c, this.plugboardPairs);
  
  // Forward through rotors
  for (let i = this.rotors.length - 1; i >= 0; i--) {
    c = this.rotors[i].forward(c);
  }

  // Through reflector
  c = REFLECTOR[alphabet.indexOf(c)];

  // Backward through rotors
  for (let i = 0; i < this.rotors.length; i++) {
    c = this.rotors[i].backward(c);
  }

  // Apply plugboard at output (this line was missing)
  c = plugboardSwap(c, this.plugboardPairs);

  return c;
}
```

This change ensures that the plugboard swaps are correctly applied both at the beginning and at the end of the encryption/decryption process, which is how the actual Enigma machine worked. Without this second application of the plugboard, messages with plugboard settings would not properly decrypt back to their original form.

After fixing this issue, the Enigma machine now correctly encrypts and decrypts messages with all configuration options, including plugboard pairs. 