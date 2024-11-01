import {
    IconBrandGithub,
    IconBrandDiscord,
    IconBrandX,
    IconBrandYoutube,
    IconBrandTwitch,
    IconBrandLinkedin,
    IconBrandReddit,
  } from "@tabler/icons-react";
  
  const SocialIcon = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-neutral-400 hover:text-neutral-100 transition-colors"
      aria-label={label}
    >
      {icon}
    </a>
  );
  
  export const SocialLinks = () => (
    <div className="flex gap-4 pt-2">
      <SocialIcon href="https://github.com/Far-Beyond-Pulsar/Pulsar-Engine" icon={<IconBrandGithub />} label="GitHub" />
      <SocialIcon href="https://discord.gg/NM4awJWGWu" icon={<IconBrandDiscord />} label="Discord" />
      <SocialIcon href="#" icon={<IconBrandX />} label="X (Twitter)" />
      <SocialIcon href="#" icon={<IconBrandYoutube />} label="YouTube" />
      <SocialIcon href="#" icon={<IconBrandTwitch />} label="Twitch" />
      <SocialIcon href="#" icon={<IconBrandLinkedin />} label="LinkedIn" />
      <SocialIcon href="#" icon={<IconBrandReddit />} label="Reddit" />
    </div>
  );
  
  export default SocialLinks;