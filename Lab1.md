Part 1: DNS Report

nslookup google.com
nslookup -type=NS google.com
nslookup -type=A -debug google.com

google.com
 A record: 142.251.20.113
 TTL: 221 seconds (~3 min) 
 Nameservers: ns1.google.com, ns2.google.com, ns3.google.com, ns4.google.com

wikipedia.org
 A record: 185.15.58.224
 TTL: 69 seconds (~1 min) 
 Nameservers: ns0.wikimedia.org, ns1.wikimedia.org, ns2.wikimedia.org

github.com
 A record: 140.82.121.3
 TTL: 23 seconds 
 Nameservers: ns-421.awsdns-52.com, ns-1707.awsdns-21.co.uk, dns1.p08.nsone.net


Part 2: curl Scavenger Hunt
200 OK:
curl -s -o NUL -w "%{http_code}" https://github.com

404 Not Found:
curl -s -o NUL -w "%{http_code}" https://example.com/nonexistent


Part 3: DevTools Network Analysis (youtube.com)
1)CSS file:
 Name: www-main-desktop-watch-page-skeleton-2x.css
 Type: stylesheet
 Status: 200
 This is a CSS file that controls the visual appearance and layout of the YouTube watch page

2)JavaScript file:
 Name: base.js
 Type: script
 Status: 200
 This is the core JavaScript file that handles the main logic and functionality of the YouTube page

3)Media file:
 Name: success.mp3
 Type: media
 Status: 304 (Not Modified)
 This is an audio file, a notification sound. Status 304 means the browser already had it cached and did not need to download it again
