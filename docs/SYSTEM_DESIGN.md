# Sistema de Design e Design Tokens

Este documento define os elementos visuais fundamentais do projeto, servindo como a "única fonte da verdade" para a UI. Os tokens aqui definidos serão usados para configurar o TailwindCSS e garantir uma aparência consistente em toda a aplicação.

## 1. Design Tokens (JSON)

O JSON a seguir representa os tokens de design extraídos do CSS original. Ele deve ser usado como referência para a implementação no `tailwind.config.ts`.

```json
{
  "color": {
    "background": {
      "default": { "value": "#ffffff", "description": "Cor de fundo principal do site" },
      "light": { "value": "#f2f2f3", "description": "Cor de fundo para seções claras" },
      "dark": { "value": "#000820", "description": "Cor de fundo para seções escuras (Hero, Footer)" }
    },
    "surface": {
      "default": { "value": "#ffffff", "description": "Cor de fundo para elementos elevados (cards, caixas)" },
      "dark": { "value": "#001553", "description": "Surface para o tema escuro" }
    },
    "text": {
      "default": { "value": "#2f3138", "description": "Cor de texto padrão" },
      "heading": { "value": "#0e1b4d", "description": "Cor para títulos (h1, h2, etc.)" },
      "contrast": { "value": "#ffffff", "description": "Cor de texto para fundos escuros ou de destaque" },
      "muted": { "value": "rgba(47, 49, 56, 0.6)", "description": "Cor para texto secundário ou desabilitado" }
    },
    "accent": {
      "primary": { "value": "#5E1FB6", "description": "Cor de destaque principal (botões, links)" },
      "primary-hover": { "value": "rgba(94, 31, 182, 0.85)", "description": "Hover da cor de destaque" }
    },
    "border": {
      "default": { "value": "rgba(47, 49, 56, 0.15)", "description": "Cor de borda sutil" }
    },
    "status": {
        "success": { "value": "#059652", "description": "Cor para mensagens de sucesso" },
        "error": { "value": "#5E1FB6", "description": "Cor para mensagens de erro (no template original, usa o accent)" }
    }
  },
  "font": {
    "family": {
      "sans": { "value": ["Roboto", "system-ui", "sans-serif"], "description": "Fonte para corpo de texto" },
      "display": { "value": ["Raleway", "sans-serif"], "description": "Fonte para títulos e navegação" }
    },
    "size": {
      "xs": { "value": "0.75rem" }, "sm": { "value": "0.875rem" }, "base": { "value": "1rem" },
      "lg": { "value": "1.125rem" }, "xl": { "value": "1.25rem" }, "2xl": { "value": "1.5rem" },
      "3xl": { "value": "1.875rem" }, "4xl": { "value": "2.25rem" }, "5xl": { "value": "3rem" },
      "6xl": { "value": "4rem" }
    },
    "weight": {
      "normal": { "value": "400" }, "medium": { "value": "500" }, "semibold": { "value": "600" }, "bold": { "value": "700" }
    }
  },
  "spacing": {
    "base": "4px",
    "scale": {
      "1": "4px", "2": "8px", "3": "12px", "4": "16px", "5": "20px", "6": "24px",
      "8": "32px", "10": "40px", "12": "48px", "16": "64px"
    }
  },
  "radius": {
    "sm": { "value": "4px" }, "md": { "value": "6px" }, "lg": { "value": "8px" },
    "full": { "value": "9999px", "description": "Para elementos circulares/pill" }
  },
  "shadow": {
    "sm": { "value": "0px 1px 2px rgba(0, 0, 0, 0.05)" },
    "md": { "value": "0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)" },
    "lg": { "value": "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)" },
    "xl": { "value": "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)" }
  },
  "zIndex": {
    "header": { "value": 997 },
    "modal": { "value": 1000 },
    "preloader": { "value": 999999 }
  }
}