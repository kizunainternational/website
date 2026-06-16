# Kizuna International Education Website

A fully responsive, modern educational consultancy website for `Kizuna International Education`, built with pure HTML5, CSS3, and vanilla JavaScript.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript

No framework dependencies are used.

## Project Structure

```text
kizuna-website/
|-- index.html
|-- css/
|   |-- style.css
|-- js/
|   |-- script.js
|-- assets/
|   |-- logo/
|   |   |-- kizuna-logo.jpeg
|   |   |-- banner1.png
|   |   |-- banner2.png
|   |-- images/
|   |-- icons/
|-- README.md
```

## Included Sections

1. Sticky navigation with mobile menu
2. Hero section with CTA and brand banners
3. Why Study in Japan
4. Services
5. Application process timeline
6. Why Choose Kizuna
7. Testimonial slider
8. Gallery placeholders
9. Contact section with form and Facebook link
10. Footer with quick links and services

## Accessibility and SEO

- Semantic landmarks and heading structure
- Keyboard-friendly controls
- Skip-to-content link
- Visible focus states
- Meta title and description
- Open Graph tags

## Run Locally

1. Open index.html directly in a browser
2. For best development workflow, use a local static server in VS Code

## Customization Notes

- Update contact details in the contact section of index.html
- Change map embed query in the contact iframe to your exact office location
- Replace gallery placeholders with real images in assets/images
- Update testimonial content as real student stories become available
- Update canonical and OG URL values for production domain

## Web3Forms Setup (Stub Ready)

The contact form is already connected to the Web3Forms endpoint in placeholder mode.

1. Open index.html and find the hidden input:
	- name="access_key"
	- value="YOUR_WEB3FORMS_ACCESS_KEY"
2. Replace the placeholder value with your real Web3Forms key.
3. Optionally update hidden fields such as subject and from_name.
4. After key replacement, form submissions will be posted to Web3Forms.

Current behavior:

- If key is still placeholder, submission is blocked and an inline message appears.
- If key is set, the form proceeds with normal POST submission.

## Facebook Link

Configured at:

- Mobile/desktop navigation quick link
- Contact section
- Footer social section

URL: https://www.facebook.com/kizunakathmandu
