import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-neutral-50 mt-20">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a href="/" className="flex items-center">
              <Image
                src={"/logo.png"}
                width={200}
                height={100}
                alt="macromapper footer logo"
              />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:gap-20">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-neutral-900 uppercase">
                Resources
              </h2>
              <ul className="text-neutral-500 font-medium">
                <li className="mb-4">
                  <Link
                    href="https://get.macromapper.co/macromapping"
                    target="_blank"
                    className="hover:underline"
                  >
                    Get Listed
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href={"https://get.macromapper.co/about-us"}
                    target="_blank"
                    className="hover:underline"
                  >
                    About Us
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    target="_blank"
                    href="https://get.macromapper.co/calculator"
                    className="hover:underline"
                  >
                    Calorie Calculator
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    target="_blank"
                    href="https://get.macromapper.co/contact"
                    className="hover:underline"
                  >
                    Contact
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    target="_blank"
                    href="https://get.macromapper.co/contact"
                    className="hover:underline"
                  >
                    Media & Enquiries
                  </Link>
                </li>
              </ul>
            </div>
            {/* <div>
              <h2 className="mb-6 text-sm font-semibold text-neutral-900 uppercase">
                Follow us
              </h2>
              <ul className="text-neutral-500 font-medium">
                <li className="mb-4">
                  <a
                    href="https://www.facebook.com/profile.php?id=61560171929104"
                    className="hover:underline flex items-center"
                  >
                    Facebook
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://x.com/MacroMapper"
                    className="hover:underline flex items-center"
                  >
                    X
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://www.instagram.com/macromapper.co/"
                    className="hover:underline flex items-center"
                  >
                    Instagram
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://www.tiktok.com/@macromapper"
                    className="hover:underline flex items-center"
                  >
                    Tiktok
                  </a>
                </li>
              </ul>
            </div> */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-neutral-900 uppercase">
                Legal
              </h2>
              <ul className="text-neutral-500 font-medium">
                <li className="mb-4">
                  <Link
                    target="_blank"
                    href="https://get.macromapper.co/disclaimer"
                    className="hover:underline"
                  >
                    Disclaimer
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    href="https://get.macromapper.co/terms-of-use"
                    className="hover:underline"
                    target="_blank"
                  >
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://get.macromapper.co/privacy-policy"
                    className="hover:underline"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-neutral-200 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-neutral-500 sm:text-center">
            2024{" "}
            <a href="https://macromapper.com/" className="hover:underline">
              macromapper™
            </a>
            . All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0 space-x-5">
            <a
              href="https://www.facebook.com/profile.php?id=61560171929104"
              className="text-neutral-500 hover:text-neutral-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#525252"
                viewBox="0 0 256 256"
              >
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"></path>
              </svg>
              <span className="sr-only">Facebook page</span>
            </a>
            <a
              href="https://x.com/MacroMapper"
              className="text-neutral-500 hover:text-neutral-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#525252"
                viewBox="0 0 256 256"
              >
                <path d="M214.75,211.71l-62.6-98.38,61.77-67.95a8,8,0,0,0-11.84-10.76L143.24,99.34,102.75,35.71A8,8,0,0,0,96,32H48a8,8,0,0,0-6.75,12.3l62.6,98.37-61.77,68a8,8,0,1,0,11.84,10.76l58.84-64.72,40.49,63.63A8,8,0,0,0,160,224h48a8,8,0,0,0,6.75-12.29ZM164.39,208,62.57,48h29L193.43,208Z"></path>
              </svg>
              <span className="sr-only">X page</span>
            </a>
            <a
              href="https://www.instagram.com/macromapper.co/"
              className="text-neutral-500 hover:text-neutral-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#525252"
                viewBox="0 0 256 256"
              >
                <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
              </svg>
              <span className="sr-only">Instagram page</span>
            </a>
            <a
              href="https://www.tiktok.com/@macromapper"
              className="text-neutral-500 hover:text-neutral-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#525252"
                viewBox="0 0 256 256"
              >
                <path d="M224,72a48.05,48.05,0,0,1-48-48,8,8,0,0,0-8-8H128a8,8,0,0,0-8,8V156a20,20,0,1,1-28.57-18.08A8,8,0,0,0,96,130.69V88a8,8,0,0,0-9.4-7.88C50.91,86.48,24,119.1,24,156a76,76,0,0,0,152,0V116.29A103.25,103.25,0,0,0,224,128a8,8,0,0,0,8-8V80A8,8,0,0,0,224,72Zm-8,39.64a87.19,87.19,0,0,1-43.33-16.15A8,8,0,0,0,160,102v54a60,60,0,0,1-120,0c0-25.9,16.64-49.13,40-57.6v27.67A36,36,0,1,0,136,156V32h24.5A64.14,64.14,0,0,0,216,87.5Z"></path>
              </svg>
              <span className="sr-only">Tiktok page</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
