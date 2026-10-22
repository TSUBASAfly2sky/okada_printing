# Security policy

This website is published as a static site on GitHub Pages. Its production
repository must contain only client-side assets such as HTML, CSS, JavaScript,
images, and documents. PHP and WordPress server files are not used.

## PHP security boundary

- Do not add PHP files, Composer manifests, WordPress configuration, or
  `.htaccess` files to this repository.
- The automated static-site security check must pass before deployment.
- If server-side processing becomes necessary, deploy it as a separately
  maintained service with supported software and an explicit patching process.
- Contact form submissions continue to use the configured external form service;
  no PHP mail script is hosted by this site.

## Incident response

If an unexpected PHP or WordPress endpoint becomes reachable under
`okada-printing.com`, treat it as a deployment or DNS incident: remove public
access, confirm the active DNS and GitHub Pages configuration, and inspect the
former hosting environment separately.
