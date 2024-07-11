export const metadata = {
  title: "About Us - Macromapper",
  description:
    "Macromapper: Discover nutritional information and macros of restaurants across Australia. Find protein, allergens, and more to make informed dining choices.",
  openGraph: {
    title: "About Us - Macromapper",
    description:
      "Macromapper: Discover nutritional information and macros of restaurants across Australia. Find protein, allergens, and more to make informed dining choices.",
    images: "/logo.png",
    url: "https://macromapper.com/about",
  },
};

export default function RootLayout({ children }: { children: any }) {
  return <>{children}</>;
}
