import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import React from "react";
import iconCart from "./icon-cart.png";
import iconHeartOutline from "./icon-heart-outline.png";
import iconSearch from "./icon-search.png";
import iconUser from "./icon-user.png";

export default function CollectionSection() {
  const navigationItems = [
    { label: "New & featured", href: "#" },
    { label: "Men", href: "#" },
    { label: "Women", href: "#" },
    { label: "Kids", href: "#" },
    { label: "Accessories", href: "#" },
    { label: "Sales", href: "#" },
  ];

  const iconButtons = [
    {
      icon: iconSearch,
      alt: "Search",
      action: () => console.log("Search clicked"),
    },
    {
      icon: iconUser,
      alt: "User account",
      action: () => console.log("User account clicked"),
    },
    {
      icon: iconHeartOutline,
      alt: "Wishlist",
      action: () => console.log("Wishlist clicked"),
    },
    {
      icon: iconCart,
      alt: "Shopping cart",
      action: () => console.log("Cart clicked"),
    },
  ];

  return (
    <header className="absolute w-[1372px] h-[58px] top-8 left-[626px]">
      <div className="flex items-center justify-between">
        <a
          href="/"
          className="absolute top-0 left-0 [font-family:'Kaushan_Script-Regular',Helvetica] font-normal text-[#eddfcb] text-[40px] tracking-[0] leading-[normal]"
        >
          Fashion Store
        </a>

        <NavigationMenu className="absolute top-[17px] left-[305px]">
          <NavigationMenuList className="flex w-[759px] h-6 items-center justify-center gap-[37px]">
            {navigationItems.map((item, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink
                  href={item.href}
                  className="relative w-fit mt-[-1.00px] [font-family:'Montserrat-Bold',Helvetica] font-bold text-[#eddfcb] text-xl tracking-[0] leading-[normal] whitespace-nowrap"
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="absolute w-[221px] h-7 top-[15px] left-[1149px]">
          <div className="flex w-[221px] h-7 items-center justify-center gap-[31.43px] relative opacity-[0.74]">
            {iconButtons.map((button, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className="p-0 h-auto bg-transparent hover:bg-transparent"
                onClick={button.action}
                aria-label={button.alt}
              >
                <img
                  className={`relative ${
                    index === 0
                      ? "w-[31.43px] h-[31.43px] mt-[-1.53px] mb-[-1.53px]"
                      : index === 1
                        ? "w-[28.2px] h-[28.36px]"
                        : index === 2
                          ? "w-[30.62px] h-[28.27px]"
                          : "w-[28.2px] h-[28.22px]"
                  }`}
                  alt={button.alt}
                  src={button.icon}
                />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}