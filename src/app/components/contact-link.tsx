"use client"

import Link from "next/link"

export default function ContactLink() {
  return (
    <Link
      className="text-xs hover:underline underline-offset-4"
      href="mailto:melvindarialyogiana@gmail.com"
      title="Send email to melvindarialyogiana@gmail.com"
      onClick={(e) => {
        const fallback = () => {
          navigator.clipboard.writeText("melvindarialyogiana@gmail.com").then(() => {
            alert("Email address copied to clipboard: melvindarialyogiana@gmail.com");
          }).catch(() => {
            alert("Email: melvindarialyogiana@gmail.com");
          });
        };

        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (!isMobile && !window.confirm("This will open your email client. Click OK to continue, or Cancel to copy the email address instead.")) {
          e.preventDefault();
          fallback();
        }
      }}
    >
      Contact
    </Link>
  )
}
