import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin 
} from "lucide-react";

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Accessibility", href: "/accessibility" },
    { label: "Data Protection", href: "/data-protection" }
  ];

  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Contact Support", href: "/support" },
    { label: "Documentation", href: "/docs" },
    { label: "Help Center", href: "/help" }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  return (
    <footer className="bg-muted/30 border-t mt-auto">
      <div className="container mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Institution Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">IAOMS</h3>
            <p className="text-sm text-muted-foreground">
              Institutional Approval and Office Management System - Streamlining academic administration with digital efficiency.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Educational Institution Campus</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 XXX XXX XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>admin@institution.edu</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-medium">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground"
                    asChild
                  >
                    <a href={link.href}>{link.label}</a>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="font-medium">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground"
                    asChild
                  >
                    <a href={link.href}>{link.label}</a>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="font-medium">Connect With Us</h4>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <Button 
                  key={social.label}
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8"
                  asChild
                >
                  <a href={social.href} aria-label={social.label}>
                    <social.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Office Hours</p>
              <p className="text-sm text-muted-foreground">
                Monday - Friday: 9:00 AM - 5:00 PM<br />
                Saturday: 9:00 AM - 1:00 PM
              </p>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © {currentYear} Institutional Approval and Office Management System (IAOMS). All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Version 1.0.0</span>
            <Separator orientation="vertical" className="h-4" />
            <span>Built with ❤️ for Education</span>
          </div>
        </div>
      </div>
    </footer>
  );
}