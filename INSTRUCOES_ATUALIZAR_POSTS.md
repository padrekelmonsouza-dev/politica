# 📋 Instruções para Atualizar Posts das Redes Sociais

## ✅ Estrutura Implementada

O site agora mostra **4 posts individuais em cards** para cada rede social:
- Instagram (@pekelmon)
- YouTube (@PadreKelmonBr)
- TikTok (@pekelmon)
- **X / Twitter (@PeKelmon)** ✨ NOVO!
- Facebook (PadreKelmon)

---

## 📝 Como Atualizar os Posts

### 🔴 **1. INSTAGRAM** (@pekelmon)

1. Acesse: https://www.instagram.com/pekelmon/
2. Abra cada um dos **4 últimos posts**
3. Na URL do post, copie o **código** (exemplo: `/p/ABC123xyz/`)
4. No arquivo `src/components/landing/media.tsx`:
   - Substitua `LATEST_POST_1` pelo código real
   - Substitua `LATEST_POST_2` pelo código real
   - Substitua `LATEST_POST_3` pelo código real
   - Substitua `LATEST_POST_4` pelo código real

**Exemplo:**
```
Antes: https://www.instagram.com/p/LATEST_POST_1/
Depois: https://www.instagram.com/p/DCxYz123ABC/
```

---

### 🔴 **2. YOUTUBE** (@PadreKelmonBr)

1. Acesse: https://www.youtube.com/@PadreKelmonBr/videos
2. Abra cada um dos **4 últimos vídeos**
3. Na URL do vídeo, copie o **ID** (exemplo: `?v=XYZ789abc`)
4. No arquivo `src/components/landing/media.tsx`:
   - Substitua `VIDEO_ID_1` pelo ID real (sem o `?v=`)
   - Substitua `VIDEO_ID_2` pelo ID real
   - Substitua `VIDEO_ID_3` pelo ID real
   - Substitua `VIDEO_ID_4` pelo ID real

**Exemplo:**
```
Antes: https://www.youtube.com/embed/VIDEO_ID_1
Depois: https://www.youtube.com/embed/dQw4w9WgXcQ
```

---

### 🔴 **3. TIKTOK** (@pekelmon)

1. Acesse: https://www.tiktok.com/@pekelmon
2. Abra cada um dos **4 últimos vídeos**
3. Na URL do vídeo, copie o **ID numérico** (exemplo: `/video/1234567890123456789`)
4. No arquivo `src/components/landing/media.tsx`:
   - Substitua `VIDEO_ID_1` pelo ID real
   - Substitua `VIDEO_ID_2` pelo ID real
   - Substitua `VIDEO_ID_3` pelo ID real
   - Substitua `VIDEO_ID_4` pelo ID real

**Exemplo:**
```
Antes: data-video-id="VIDEO_ID_1"
Depois: data-video-id="7234567890123456789"
```

---

### ✨ **4. X / TWITTER** (@PeKelmon) - NOVO!

1. Acesse: https://x.com/PeKelmon
2. Abra cada um dos **4 últimos tweets**
3. Na URL do tweet, copie o **ID numérico** (exemplo: `/status/1234567890123456789`)
4. No arquivo `src/components/landing/media.tsx`:
   - Substitua `TWEET_ID_1` pelo ID real
   - Substitua `TWEET_ID_2` pelo ID real
   - Substitua `TWEET_ID_3` pelo ID real
   - Substitua `TWEET_ID_4` pelo ID real

**Exemplo:**
```
Antes: https://x.com/PeKelmon/status/TWEET_ID_1
Depois: https://x.com/PeKelmon/status/1756789012345678901
```

---

### 🔵 **5. FACEBOOK** (PadreKelmon)

1. Acesse: https://www.facebook.com/PadreKelmon
2. Abra cada um dos **4 últimos posts**
3. Na URL do post, copie o **ID** (exemplo: `/posts/pfbid...` ou número)
4. No arquivo `src/components/landing/media.tsx`:
   - Substitua `POST_ID_1` pelo ID real
   - Substitua `POST_ID_2` pelo ID real
   - Substitua `POST_ID_3` pelo ID real
   - Substitua `POST_ID_4` pelo ID real

**Exemplo:**
```
Antes: https://www.facebook.com/PadreKelmon/posts/POST_ID_1
Depois: https://www.facebook.com/PadreKelmon/posts/pfbid0ABC123xyz
```

---

## 🎯 Localização no Código

Arquivo: `src/components/landing/media.tsx`

Procure por:
- `LATEST_POST_1`, `LATEST_POST_2`, etc. (Instagram)
- `VIDEO_ID_1`, `VIDEO_ID_2`, etc. (YouTube e TikTok)
- `TWEET_ID_1`, `TWEET_ID_2`, etc. (X/Twitter)
- `POST_ID_1`, `POST_ID_2`, etc. (Facebook)

---

## ⚠️ Importante

- **Sempre use URLs REAIS** dos posts publicados
- **Não invente IDs** - copie exatamente das URLs
- Após atualizar, os posts aparecerão automaticamente no site
- Os scripts das redes já carregam automaticamente
- **A rede X (Twitter) foi adicionada com sucesso!** ✅

---

## 🚀 Resultado Final

Cada rede social mostrará:
- ✅ **4 posts individuais em cards**
- ✅ **Layout responsivo** (4 colunas desktop, 2 tablet, 1 mobile)
- ✅ **Widgets oficiais embed** de cada plataforma
- ✅ **Botão "Ver todos"** para acessar o perfil completo
- ✅ **Rede X (Twitter)** incluída com @PeKelmon

---

## 📞 Suporte

Se tiver dúvidas sobre como obter os IDs dos posts, consulte a documentação oficial de cada plataforma ou entre em contato.
