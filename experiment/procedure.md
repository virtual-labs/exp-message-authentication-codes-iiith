### **Part 1: Basic CBC-MAC Implementation**

**STEP 1:** **Familiarize yourself with the simulation interface**

- **Learning Mode**: Choose from 4 examples (Basic, Intermediate, Advanced, Complex)
- **Free-Form Mode**: Generate random values and experiment freely
- Each mode provides guided learning with step-by-step explanations

**STEP 2:** **Set up the basic parameters**

- **Plaintext**: Use provided examples or click "Next Plaintext" for random text
- **Key**: Use provided key or click "Next Key" for a random key
- **IV Length (l)**: Set length where l < (plaintext length)/2
- **IV**: Use provided IV or click "Next IV" for random initialization vector

**STEP 3:** **Test the cryptographic function F_k**

- **Enter binary text** of the required length in the "Your text" field
- **Click "Apply Function"** to see how F_k transforms your input
- **Observe the calculation details** showing step-by-step XOR/EQV operations
- **Click "Generate New Function"** to experiment with different function patterns

**STEP 4:** **Calculate the CBC-MAC step by step**

- **Follow the algorithm**: XOR each plaintext block with the previous result (starting with IV)
- **Apply F_k function** to get the next intermediate value
- **Continue the process** until all blocks are processed
- **Use the learning examples** for guided practice with expected results

**STEP 5:** **Enter your final result and verify**

- **Input your calculated MAC** in the "Final Output" field
- **Click "Check Answer!"** to validate your result using the dataset examples
- **Click "Check (Original)"** for algorithmic verification without examples
- **Review feedback** and correct any mistakes with provided explanations

### **Part 2: Secure CBC-MAC Implementation**

**STEP 6:** **Proceed to secure CBC-MAC section**

- **Understand the security risks** of basic CBC-MAC for variable-length messages
- **Learn about countermeasures** against length extension attacks

**STEP 7:** **Select a security enhancement method**

Choose from the dropdown menu:

- **Compute and use your key**: Manual key derivation approach
- **Prepend the message with its length**: Length extension attack prevention
- **Two keys**: Enhanced security using dual-key construction

**STEP 8:** **Set up secure parameters**

- **Plaintext**: Click "Next Plaintext" for random secure examples
- **Key**: Click "Next Key" for appropriate key generation
- **IV Length and IV**: Set parameters following the same rules as Part 1

**STEP 9:** **Test the secure function F_k**

- **Use the same testing interface** as Part 1 with enhanced security features
- **Click "Apply Function"** to see secure function transformations
- **Click "Generate New Function"** to experiment with secure function patterns
- **Observe enhanced calculation details** specific to secure CBC-MAC

**STEP 10:** **Calculate secure CBC-MAC**

- **Follow the enhanced algorithm** based on your chosen security method
- **Apply security measures** (length prefixing, key derivation, etc.)
- **Complete the calculation** using the secure construction

**STEP 11:** **Verify your secure implementation**

- **Enter your result** in the secure CBC-MAC output field
- **Click "Check Secure CBC-MAC!"** to validate your security approach
- **Compare results** between basic and secure implementations
