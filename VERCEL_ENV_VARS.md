# Vercel Environment Variables

Copy these **exact values** into your Vercel project settings:

## 1. FIREBASE_PROJECT_ID
```
aureal-aae33
```

## 2. FIREBASE_CLIENT_EMAIL
```
firebase-adminsdk-fbsvc@aureal-aae33.iam.gserviceaccount.com
```

## 3. FIREBASE_PRIVATE_KEY

**Try copying this value EXACTLY as shown (with quotes this time):**

```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDaod6aEmgyUpok\n20rX04WKLjq+3Zh8GVNAt8L1WBKyR5HOf725JItqR627CnmAZ0ZUgk2YFgdIu4Dh\n9kd8xnIgTVaYIYFO1YvZ+LxHHHPqhI3AqHyZwyRd7moGi9yTkdjZ6wzxVJVcv+HV\nneWbvg+zg6qb2PUMlPQoCUc+cGBLZUD7qAGfxHu+dccbLqvOYD8PCF6g0YWM2ej2\nCVfLTMjUaeJtEUsiZNAwcG72OUkYZD0IXlfEDAxOSZrqsCi4R2fmZNFJfSFP6RKG\nqktzP/PUG66Nz6+XxWuvR2lfQIbYhQ2pHSP92+QwsuOR5cHBRgmcg4Brt6C/cmIE\nbUugrNb/AgMBAAECggEANYvdjBikAmcur4Yx72gz1aL66lI1jXdaZ4haLGK0uYtD\nz7KDkfu8VXxWtW+cUHF6zSnYvT3v7MVXjIAYBBxKSVUHt1zFYbx1cx4zZqs2TKLI\nYP4i/jnIB2Vj/FR24oGe/chOtDCGIGAyfHIekSVcjRfbSi453ioBHmkfVNCLFQu0\nmNSsj5cY3jG3V15dn0INTxIrAl0VEA4TWvR4DbN07Uinn7t3MjJQoP9qH+Pxst//\nX/a+Yfkg7FUQJ4cX3zv71uG/hbIvQ4WyfcACK+TEgbYdidQGf2LlyqiLUSBW/dQV\nNxJAviLNIxpxmrpS9jJ0SoQ6pDDrXEuJirohc3C+EQKBgQDvcWGW0/cvlGidBd0i\ncdBN/xgTlFwSlxbsYx0v4xHGMbVdVOE7YwPIhRKM7SofqKHGsJ3nx8BqOGDi9HTy\npik4epNwQ7Oz30MPWiu++cr/7oVoARj4YWwjoXp52dm3VL1bLxXDCeLwvK7JWJjI\n2sC+yDOq8bwh0fY7HLHJArV5BwKBgQDpwBli7c+eaNFpCIQYdqT0H16tEFEobWj6\nnJcppJT8Rqc8WBxNOJWiEXj6h0eg4fn2HLS9vgF8tZegE5b57+zacjhXIIW1P3Ip\nVUCej/ZLRk8K6qlIAhfOrALHx/JtfRB04OjOoRN0QpikQtbjvlqi7tfMSHeejStr\nf5LecXcMSQKBgB5FCh5EK6KTM2puXFdHZhsGHagUAFPFT/uQSBdOsGeKzy++VD7q\ntIa78+1m6gVYjyMMHto3UWbcO7tVRheK0/k03cC6flRF7Ddbod4hu/0AzVKpmNuF\njWMvvcj7tl9L0ihd2nVuoYbng30muyHhLa6wpn980djAr00nwn3z3rcvAoGAAKRa\nbX8httmq2ZMAaeDJizIa3HbTAj1qsGWFtMOS9S5sfynuyfeB0bQilO2SMMruGNLz\nXCINdv44sGPdYkpaaC8wIG0icOD/u0VUrBrRHlvPE8SZOm1nC1ZFm67c55gUV33W\npdqjZwpXyPu2A2IedZwaU6FPUswodl8fVCUToqECgYEAph25q/lRvntUNBZ7PDi1\n4ex2pTEl7vYt76o7JlwpoOLZjpS8xmLnSk6ZMTlfrVWF1MOWuIXkChmR+3cJtQn0\nLKjAHnkIzIZsRvaH1p+C8jvwzBtxPvLqixrMpphs90CLvO2SYd1hgOMRPs9CHU4f\nCaEHmSInyxzM3Zz7FJwAsG0=\n-----END PRIVATE KEY-----\n"
```

## 4. NEXT_PUBLIC_APP_URL
```
https://aureallabs.com
```

---

## How to Add These in Vercel:

1. Go to your Vercel project dashboard
2. Click **Settings** > **Environment Variables**
3. For each variable:
   - Enter the **Name** (e.g., `FIREBASE_PROJECT_ID`)
   - Enter the **Value** (copy from above)
   - Select all environments: **Production**, **Preview**, **Development**
   - Click **Save**
4. After adding all 4 variables, trigger a new deployment:
   - Go to **Deployments** tab
   - Click the **⋯** menu on the latest deployment
   - Click **Redeploy**
   - Check **"Use existing Build Cache"** OFF
   - Click **Redeploy**

---

**Important Notes:**
- The `FIREBASE_PRIVATE_KEY` should NOT have quotes around it in Vercel
- The `\n` characters in the private key are intentional - don't remove them
- Copy the entire key from `-----BEGIN` to the final `\n` after `-----END PRIVATE KEY-----`
- Make sure there are no extra spaces before or after any values
- If you see "Invalid PEM formatted message" error, double-check you copied the key correctly
