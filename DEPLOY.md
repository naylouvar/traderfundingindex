# Deploying on an OVH VPS with CloudPanel

This guide takes a fresh OVH VPS running Ubuntu 24.04 to a live TraderFundingIndex site.
Replace `YOUR_VPS_IP` and `traderfundingindex.com` with your own values.

## 1. Point the domain at the VPS

At your domain registrar, create two DNS records:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `YOUR_VPS_IP` |
| A | `www` | `YOUR_VPS_IP` |

DNS can take a while to spread, so do this first.

## 2. Install CloudPanel

Connect to the VPS as root (OVH emails you the login):

```bash
ssh root@YOUR_VPS_IP
```

Update the system, then run the official installer with MySQL 8.4. The checksum line makes sure the installer has not been tampered with.

```bash
apt update && apt -y upgrade && apt -y install curl wget sudo
curl -sS https://installer.cloudpanel.io/ce/v2/install.sh -o install.sh; \
echo "8146dbe0a488e7088b04071b0c34d59aa0ab1fe9dcec382d395fd155c9e6c476 install.sh" | \
sha256sum -c && sudo DB_ENGINE=MYSQL_8.4 bash install.sh
```

If the checksum check fails, CloudPanel has released a new installer: copy the current command from the
[CloudPanel install docs](https://www.cloudpanel.io/docs/v2/getting-started/other/) instead.

## 3. Create the admin account

Open `https://YOUR_VPS_IP:8443` right away and create your admin user (anyone who reaches the page first can).
The browser warns about the certificate: choose "Advanced" and continue.

Then, in **Admin Area > Security**, restrict port 8443 to your own IP address.

## 4. Add the Node.js site

In CloudPanel, click **Add Site > Create a Node.js Site**:

- **Domain Name:** `www.traderfundingindex.com`
- **Node.js Version:** 22
- **App Port:** `3000`
- Note the **Site User** name and password CloudPanel shows. You use them to log in over SSH.

Open the new site and go to **SSL/TLS > Actions > New Let's Encrypt Certificate** to get free HTTPS.

## 5. Create the database

In the site, open **Databases > Add Database**. Note the database name, user name and password.

## 6. Get the code onto the server

Log in as the site user (not root):

```bash
ssh SITE_USER@YOUR_VPS_IP
cd ~/htdocs
rm -rf www.traderfundingindex.com
git clone https://github.com/naylouvar/traderfundingindex.git www.traderfundingindex.com
cd www.traderfundingindex.com
```

Create the `.env` file with the database details from step 5:

```bash
cat > .env <<EOT
DATABASE_URL="mysql://DB_USER:DB_PASSWORD@127.0.0.1:3306/DB_NAME"
ADMIN_PASSWORD="CHOOSE_A_LONG_PASSWORD"
SESSION_SECRET="$(openssl rand -hex 32)"
EOT
```

`ADMIN_PASSWORD` is what you type at `/admin` to manage firms. `SESSION_SECRET` is generated for you.

If the password contains special characters such as `@`, `:` or `/`, URL-encode them (for example `@` becomes `%40`).

## 7. Build and start the site

```bash
npm ci
npm run db:push
npm run db:seed
npm run build
npm install -g pm2
pm2 start npm --name traderfundingindex -- start
pm2 save
```

`npm start` serves the site on port 3000, which CloudPanel forwards to your domain.
Open `https://www.traderfundingindex.com` to check it.

Make the site restart by itself after a reboot. Run `crontab -e` and add this line:

```
@reboot /bin/bash -c 'source ~/.nvm/nvm.sh && pm2 resurrect'
```

## Updating the site

After new code is pushed to GitHub, log in as the site user and run:

```bash
cd ~/htdocs/www.traderfundingindex.com
git pull
npm ci
npm run db:push
npm run build
pm2 restart traderfundingindex
```

Logos uploaded in the admin panel are saved in the `uploads` folder inside the site folder. `git pull` never touches it, so keep it when you move or rebuild the site, and include it in backups.

## Troubleshooting

- **The site shows a 502 error:** the app is not running. Check `pm2 status` and `pm2 logs traderfundingindex`.
- **The build stops with "out of memory":** the VPS needs at least 4 GB of RAM, or add a swap file.
- **Database connection errors:** check the values in `.env` match the database created in step 5.
