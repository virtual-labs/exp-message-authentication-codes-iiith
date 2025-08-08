A message authentication code (MAC) provides a way to verify both the **authenticity** and **integrity** of a message. A MAC scheme consists of three main components:

(a) **Key Generation (Gen)**

(b) **Tag Generation (Mac)**

(c) **Verification (Vrfy)**

The algorithm for key generation **Gen** is used to choose a secret key **k** at random from the set of all possible authentication keys, denoted by the key space **K**.

The algorithm for tag generation **Mac** takes as inputs the message **m** and the secret key **k** and outputs the authentication tag **t**.

The algorithm for verification **Vrfy** inputs the message **m**, the authentication tag **t**, and the key **k** and outputs either **accept** or **reject**.

A Cipher Block Chaining Message Authentication Code (CBC-MAC) is a specific technique for constructing a message authentication code from a block cipher. While CBC-MAC provides strong authentication properties when properly implemented, basic constructions have important security limitations that must be understood to avoid vulnerabilities in real-world applications.

**About the experiment:**

In this experiment, we work with both basic and secure implementations of CBC-MAC to understand their cryptographic properties and security considerations. We provide a simplified block cipher function (that demonstrates the algorithmic principles without the full complexity of real block ciphers) and guide you through computing CBC-MAC tags for arbitrary messages. Your task is to master the CBC-MAC algorithm in both its basic form and its secure variants. Specifically, you will learn to compute authentication tags step-by-step, understand the vulnerabilities of basic CBC-MAC for variable-length messages, and implement secure constructions that address these security concerns.
