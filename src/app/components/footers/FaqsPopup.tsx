import React, { useEffect, useRef } from 'react'

type Props = {
  onClose :() => void;
}

function FaqsPopup({onClose}: Props) {
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 text-base">
        <div ref={popupRef} className="flex flex-col space-y-10 w-1/2 h-3/4 overflow-y-scroll sm:w-[300px] sm:p-4 bg-black text-white rounded-xl shadow-lg px-10 py-14  sm:text-sm">

          <p className="text-4xl font-semibold text-center">FAQs</p>

          <div className="flex flex-col space-y-4">
            <p className="text-3xl font-semibold">General Questions</p>
            <div className="flex flex-col space-y-2">
              <p className="text-2xl font-medium">1. What is this platform?</p>
              <p className="text-lg">We are a Web3-based literary hub where writers can publish, share, and monetize their works using blockchain technology, while readers can discover unique content.</p>
            </div>
            <div className="flex flex-col space-y-2">
              <p className="text-2xl font-medium">2. What is Web3, and how does it enhance this platform?</p>
              <p className="text-lg">Web3 represents the next evolution of the internet, enabling decentralized ownership, blockchain technology, and secure peer-to-peer interactions. It ensures that writers retain control and ownership over their content, while also providing a globally accessible library for everyone without the high inflation fees that comes with currency conversions on international book sales.</p>
            </div>

            <div className="flex flex-col space-y-2">
              <p className="text-2xl font-medium">3. Do I need to know about blockchain or cryptocurrencies to use the platform?</p>
              <p className="text-lg">No, the platform is designed to be simple and user-friendly for everyone, including those new to blockchain technology. Naivgating web3 features has never been so easy.</p>
            </div>          
          </div>

          <div className="flex flex-col space-y-4">
            <p className="text-3xl font-semibold">For Writers</p>

            <div className="flex flex-col space-y-2">
              <p className="text-2xl font-medium">4. How can I publish my work on this platform?</p>
              <p className="text-lg">Sign up for an account, create a new story, and follow the prompts to upload and format your content.</p>
            </div>

            <div className="flex flex-col space-y-2">
              <p className="text-2xl font-medium">5. Will I retain ownership of my work?</p>
              <p className="text-lg">Yes. By publishing on our platform you retain full ownership of your work.</p>
            </div>

            <div className="flex flex-col space-y-2">
              <p className="text-2xl font-medium">6. Can I earn royalties on my work?</p>
              <p className="text-lg">Yes. A feature that we're working on implementing is the ability for writers to tokenize their work, that way you can set a percentage of royalties to be earned whenever your content is resold on secondary markets.</p>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <p className="text-3xl font-semibold">For Readers</p>

            <div className="flex flex-col space-y-2">
              <p className="text-2xl font-medium">7. How do I access stories on the platform?</p>
              <p className="text-lg">Browse our library to find free and paid content. You can purchase, and read directly through the platform.
              .</p>
            </div>

            <div className="flex flex-col space-y-2">
              <p className="text-2xl font-medium">8. What payment methods are accepted?</p>
              <p className="text-lg">We accept cryptocurrency and support fiat payments through integrated wallets. (Coming soon)</p>
            </div>

            <div className="flex flex-col space-y-2">
              <p className="text-2xl font-medium">9. Do I need a crypto wallet to use the platform?</p>
              <p className="text-lg">No, you do not need a wallet to access free content, and we are currently working on integrating a mechanism that allows users to purchase content without the need for a crypto wallet.</p>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <p className="text-3xl font-semibold">Community and Support</p>

            <div className="flex flex-col space-y-2">
              <p className="text-2xl font-medium">10. Can I interact with other users?</p>
              <p className="text-lg">Coming soon, users will be able to join community forums, participate in discussions, and engage with writers and readers through comments and feedback.</p>
            </div>

          </div>

        </div>
    </div>
  )
}

export default FaqsPopup