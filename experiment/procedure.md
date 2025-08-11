### **Part 1: Basic CBC-MAC Implementation**

**STEP 1:** **Choose your learning approach**

- **Dataset Examples**: Select from 4 pre-designed examples:
  - **Example 1: Basic** - Simple 2-block message for beginners
  - **Example 2: Intermediate** - 3-block message with step-by-step guidance
  - **Example 3: Advanced** - Complex multi-block scenario
  - **Example 4: Complex** - Challenging real-world example
- **Random Mode**: Click "Random Values" to generate random parameters for practice
- **Navigation**: Use "Previous Example" and "Next Example" to move between cases

**STEP 2:** **Examine the CBC-MAC parameters**

- **Plaintext**: View the provided binary message (automatically loaded from selected example)
- **Key (k)**: Observe the cryptographic key (click "Next Key" for random key in free mode)
- **IV Length (l)**: Note the initialization vector length (where l < plaintext length/2)
- **IV**: Study the initialization vector (click "Next IV" for random IV in free mode)

**STEP 3:** **Test and understand the cryptographic function F_k**

- **Enter binary text** of the required length in the "Your text" field
- **Click "Apply Function"** to see how F_k transforms your input using XOR/EQV operations
- **Study the detailed calculation** showing step-by-step bit operations
- **Experiment**: Click "Generate New Function" to try different function patterns
- **Observe the function display** showing the current F_k pattern

**STEP 4:** **Follow the CBC-MAC algorithm step by step**

- **Understand the process**: CBC-MAC XORs each plaintext block with the previous result
- **Start with IV**: The first block is XORed with the initialization vector
- **Apply F_k function**: Each XOR result is processed through the cryptographic function
- **Continue iteratively**: Use each F_k output as input for the next block's XOR operation
- **Final result**: The last F_k output is your CBC-MAC

**STEP 5:** **Verify your calculation**

- **Enter your result** in the "Final Output" field
- **Check with dataset**: Click "Check Answer!" to validate against the loaded example
- **Alternative check**: Click "Check (Original)" for direct algorithmic verification
- **Learn from feedback**: Review detailed explanations and corrections if needed
- **Progress tracking**: Successfully completed examples auto-advance to the next case

### **Part 2: Secure CBC-MAC Implementation**

**STEP 6:** **Learn about CBC-MAC security vulnerabilities**

- **Understand the risks**: Basic CBC-MAC is vulnerable to length extension attacks
- **Review attack scenarios**: Variable-length messages can be manipulated by attackers
- **Explore countermeasures**: Different methods to make CBC-MAC secure

**STEP 7:** **Select a security enhancement method**

Choose from the dropdown menu to explore different security approaches:

- **Compute and use your key**: Manual key derivation and modification approach
- **Prepend the message with its length**: Length-prefixing to prevent extension attacks
- **Two keys**: Enhanced dual-key construction for increased security

**STEP 8:** **Set up secure CBC-MAC parameters**

- **Plaintext**: Click "Next Plaintext" to generate examples for secure analysis
- **Key**: Use "Next Key" to generate appropriate keys for your chosen security method
- **IV Length and IV**: Configure parameters following the same constraints as Part 1
- **Observe differences**: Note how security method affects parameter handling

**STEP 9:** **Test the secure cryptographic function F_k**

- **Use enhanced interface**: Same testing approach as Part 1 but with security modifications
- **Apply secure function**: Click "Apply Function" to see secure transformations
- **Generate variations**: Use "Generate New Function" for secure function patterns
- **Study secure calculations**: Observe how security measures affect the function output

**STEP 10:** **Calculate secure CBC-MAC**

- **Follow enhanced algorithm**: Apply your chosen security method to the CBC-MAC process
- **Implement security measures**: Use length prefixing, key derivation, or dual keys as selected
- **Process systematically**: Complete the calculation using the secure construction
- **Validate each step**: Ensure security measures are properly applied

**STEP 11:** **Verify your secure implementation**

- **Enter final result**: Input your calculated secure CBC-MAC in the output field
- **Click "Check Secure CBC-MAC!"**: Validate your security-enhanced result
- **Compare implementations**: Understand differences between basic and secure approaches
- **Learn from feedback**: Review explanations of security measures and their effectiveness
