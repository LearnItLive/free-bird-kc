---
enable: true # Control the visibility of this section across all pages where it is used
title: "Flexible Retainer Model"
image: "/images/retainer-icon-1-min.png"

list:
  - enable: true
    name: "Monthly Retainer"
    description: "Reserve dedicated hours each month for ongoing executive support and operations."
    price:
      prependValue: "From $"
      value: "X,XXX"
      appendValue: "/mo"
    features:
      - Dedicated monthly hours
      - Priority access and response
      - Flexible scope across services
      - Clear activity reporting
      - Scale plan up or down
    button:
      # Refer to the `sharedButton` schema in `src/sections.schema.ts` for all available configuration options (e.g., enable, label, url, hoverEffect, variant, icon, tag, rel, class, target, etc.)
      enable: true
      label: "Request a Quote"
      url: "/#footer-with-contact"
      # hoverEffect: "" # Optional: text-flip | creative-fill | magnetic | magnetic-text-flip
      # variant: "" # Optional: fill | outline | text | circle
      # rel: "" # Optional
      # target: "" # Optional
  - enable: true
    name: "Additional Projects"
    description: "Scope larger one-off initiatives beyond your monthly retainer."
    price:
      prependValue: ""
      value: "Custom"
      appendValue: ""
    features:
      - Fixed-fee or hourly options
      - Clear scope of work
      - Timeline alignment
      - Dedicated execution support
      - Optional reporting add-ons
    button:
      # Refer to the `sharedButton` schema in `src/sections.schema.ts` for all available configuration options (e.g., enable, label, url, hoverEffect, variant, icon, tag, rel, class, target, etc.)
      enable: true
      label: "Discuss a Project"
      url: "/#footer-with-contact"
      # hoverEffect: "" # Optional: text-flip | creative-fill | magnetic | magnetic-text-flip
      # variant: "" # Optional: fill | outline | text | circle
      # rel: "" # Optional
      # target: "" # Optional
  - enable: false
    name: "Hidden"
    description: ""
    price:
      prependValue: ""
      value: ""
      appendValue: ""
    features: []
    button:
      enable: false
      label: ""
      url: "/"
      # hoverEffect: "" # Optional: text-flip | creative-fill | magnetic | magnetic-text-flip
      # variant: "" # Optional: fill | outline | text | circle
      # rel: "" # Optional
      # target: "" # Optional
---
