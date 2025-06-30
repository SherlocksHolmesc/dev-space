# 🌍 DevSpace

**Welcome to DevSpace — the gamified universe for developers!**

DevSpace is not just another developer platform. It's a vibrant, space-themed community where coders, creators, and blockchain enthusiasts come together to learn, compete, and grow. Whether you're a bounty hunter, a blog author, or a blockchain explorer, DevSpace offers a unique, interactive experience powered by modern web technologies and on-chain credentials.

---

## 🚀 What is DevSpace?

DevSpace is a **gamified developer community platform** designed to make learning, building, and sharing fun and rewarding. Here, you can:

- **Compete in Bounties:** Take on coding challenges, complete real-world tasks, and earn crypto rewards. Level up your skills and climb the leaderboard!
- **Showcase Your Achievements:** Earn on-chain certifications and badges that prove your skills — all verifiable on the blockchain.
- **Share Knowledge:** Write blog posts, comment, and vote in a collaborative, knowledge-sharing space.
- **Track Your Journey:** Build your profile, collect XP, and unlock achievements as you progress through missions and challenges.

---

## ✨ What Makes DevSpace Unique?

- **On-Chain Credentials:** Every achievement, certificate, and reward is minted as a verifiable NFT on the MasChain blockchain. Your skills are truly yours — portable, tamper-proof, and future-ready.
- **Smart Contract Automation:** Bounties, rewards, and certifications are managed by smart contracts, ensuring transparency and trust in every transaction.
- **Crypto Wallet Integration:** Users get a blockchain wallet upon registration, enabling seamless earning, spending, and tracking of tokens and certificates.
- **Space-Themed Gamification:** From cosmic XP to space ranks and constellation-inspired UI, DevSpace turns your coding journey into an interstellar adventure.
- **API-Driven & Modular:** The platform is built with a modular API layer, making it easy to extend, integrate, or even fork for your own community.

---

## 🛠️ Tech Stack & Architecture

| Layer           | Tech/Service              | Purpose/Notes                                                                |
| --------------- | ------------------------- | ---------------------------------------------------------------------------- |
| **Frontend**    | Next.js (React 19)        | Modern, fast, and scalable web framework                                     |
|                 | Tailwind CSS              | Beautiful, responsive, and customizable UI                                   |
|                 | Radix UI                  | Accessible, unstyled component primitives                                    |
| **Blockchain**  | MasChain                  | All credentials, bounties, and rewards are on-chain (NFTs, tokens, etc.)     |
|                 | Smart Contracts (API)     | Automated minting, transfers, and verification of certificates and rewards   |
| **Wallet**      | Custom Wallet Integration | Each user gets a blockchain wallet for rewards and credentials               |
| **Backend/API** | Next.js API Routes        | Handles user registration, wallet ops, bounty logic, and certificate minting |
|                 | Axios                     | Robust HTTP client for API and blockchain calls                              |
| **Persistence** | LocalStorage              | Seamless user experience and state persistence                               |
| **Other**       | Framer Motion, Lucide     | Animations and icons for a lively, space-inspired UI                         |

---

## 🪐 How DevSpace Uses MasChain Services

DevSpace is a next-gen, blockchain-powered developer platform, tightly integrated with MasChain to provide transparency, trust, and gamification. Here's how each core feature leverages MasChain's services:

### 1. **Blog Audit Trails & Verification**

- **On-Chain Audit Trail:** Every blog post and comment is recorded on-chain as an immutable audit trail, ensuring content authenticity and traceability.
- **Verified Content:** Posts that are on-chain verified display a special badge/logo, so users know the content is genuine and tamper-proof.
- **Transparency:** Anyone can check the audit trail for proof of authorship and integrity.
  
  ![image](https://github.com/user-attachments/assets/11c95411-bdb7-48e6-9bda-7a4a28712c08)

### 2. **Bounties: Custom Smart Contracts & Escrow**

- **Smart Contract Escrow:** When a user publishes a bounty, the reward amount is deducted from their wallet and locked in a custom smart contract as escrow.
- **Trustless Payouts:** Once a bounty is completed and approved, the smart contract automatically releases the reward to the winner's wallet.
- **Claiming Rewards:** Bounty hunters can claim their rewards directly from the contract, ensuring a fair and transparent process.
- **No Middleman:** The entire bounty lifecycle (creation, funding, claiming) is managed by code, not by a central authority.

  ![image](https://github.com/user-attachments/assets/356f66e2-bc84-4c2b-928a-107da671f189)


### 3. **Certification: Secure, Verified Credentials**

- **External Certification Upload:** Users can upload certificates from outside sources.
- **Verification Process:** Each certificate must be verified before being accepted. Only after approval is it minted on-chain and stored in the user's certification vault.
- **Tamper-Proof:** All certifications are stored as NFTs, making them secure, verifiable, and portable.

  ![image](https://github.com/user-attachments/assets/a0104a16-1506-48aa-8454-6a6570acbdac)


### 4. **Profile: Badges & Contributions**

- **Badge Showcase:** All earned badges (from bounties, blogs, certifications) are displayed on the user's profile.
- **Recent Contributions:** The profile tracks and displays recent user activity, including blog posts, comments, and bounty completions.
- **On-Chain Proof:** Contributions and achievements are linked to on-chain records for transparency.
  
  ![image](https://github.com/user-attachments/assets/234ee22c-3328-454f-b9f0-da27c3008ea0)

### 5. **Wallet & Token Management**

- **MAS Token:** DevSpace uses its own custom token, MAS, created and managed via MasChain's token management services.
- **Automatic Wallet Creation:** Every new user gets a unique MasChain wallet upon registration.
- **Wallet Operations:** All token operations (balance checks, transfers, escrow deposits) are handled via the wallet, with full on-chain transparency.

  ![WhatsApp Image 2025-06-30 at 21 27 41_ac16a479](https://github.com/user-attachments/assets/aea280d9-b20d-4bd8-8533-a65e95a70300)


### 🛠️ Example MasChain API Endpoints Used

- **Wallet:** `/api/wallet/create-user`, `/api/wallet/wallet/{address}/transactions-count`
- **Token:** `/api/token/mint`, `/api/token/token-transfer`, `/api/token/balance`
- **Smart Contract:** `/api/certificate/create-smartcontract`, `/api/certificate/get-smart-contract`
- **Certification:** `/api/certificate/mint-certificate`, `/api/certificate/get-certificate`
- **Audit Trail:** `/api/token/get-token-transaction`

**In summary:**  
DevSpace is a truly decentralized, gamified developer platform. Every blog, bounty, certification, and badge is backed by MasChain, making your journey provable, secure, and future-proof.

---

## 🌌 Get Started

1. **Clone the repo:**  
   `git clone https://github.com/your-username/devspace.git`

2. **Install dependencies:**  
   `npm install` or `pnpm install`

3. **Run the development server:**  
   `npm run dev`

4. **Open your browser:**  
   Visit [http://localhost:3000](http://localhost:3000) and start your journey!

---

## 🧑‍🚀 Join the DevSpace Universe

- **Contribute:** PRs and issues are welcome! Help us build the next-gen developer community.
- **Feedback:** Share your ideas and suggestions to make DevSpace even better.
- **Connect:** Join our community, complete missions, and become a legend in the DevSpace universe.

---

> _"In DevSpace, every coder is a space explorer. Ready to launch your journey?"_
