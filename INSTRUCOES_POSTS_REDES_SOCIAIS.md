# Instruções para Atualizar Posts das Redes Sociais

Este guia explica como adicionar as URLs reais dos últimos posts de cada rede social do Padre Kelmon no site.

## 📍 Arquivo a Editar

`src/components/landing/media.tsx`

## 📱 Instagram (@pekelmon)

### Como Obter os Códigos:

1. Acesse: https://www.instagram.com/pekelmon/
2. Abra os **4 últimos posts** publicados
3. Copie o código da URL de cada post

**Exemplo de URL do Instagram:**
```
https://www.instagram.com/p/ABC123xyz/
```
O código é: `ABC123xyz`

### No Código:

Encontre a seção do Instagram e substitua:

```javascript
posts: [
  { id: 1, postUrl: "https://www.instagram.com/p/ABC123xyz/", embedUrl: "https://www.instagram.com/p/ABC123xyz/embed" },
  { id: 2, postUrl: "https://www.instagram.com/p/DEF456abc/", embedUrl: "https://www.instagram.com/p/DEF456abc/embed" },
  { id: 3, postUrl: "https://www.instagram.com/p/GHI789def/", embedUrl: "https://www.instagram.com/p/GHI789def/embed" },
  { id: 4, postUrl: "https://www.instagram.com/p/JKL012ghi/", embedUrl: "https://www.instagram.com/p/JKL012ghi/embed" },
]
```

## 🎥 YouTube (@PadreKelmonBr)

### Como Obter os IDs:

1. Acesse: https://www.youtube.com/@PadreKelmonBr/videos
2. Abra os **4 últimos vídeos** publicados
3. Copie o ID da URL de cada vídeo

**Exemplo de URL do YouTube:**
```
https://www.youtube.com/watch?v=XYZ789abc
```
O ID é: `XYZ789abc`

### No Código:

```javascript
posts: [
  { id: 1, postUrl: "https://www.youtube.com/watch?v=XYZ789abc", embedUrl: "https://www.youtube.com/embed/XYZ789abc" },
  { id: 2, postUrl: "https://www.youtube.com/watch?v=ABC123def", embedUrl: "https://www.youtube.com/embed/ABC123def" },
  { id: 3, postUrl: "https://www.youtube.com/watch?v=DEF456ghi", embedUrl: "https://www.youtube.com/embed/DEF456ghi" },
  { id: 4, postUrl: "https://www.youtube.com/watch?v=GHI789jkl", embedUrl: "https://www.youtube.com/embed/GHI789jkl" },
]
```

## 🎵 TikTok (@pekelmon)

### Como Obter os IDs:

1. Acesse: https://www.tiktok.com/@pekelmon
2. Abra os **4 últimos vídeos** publicados
3. Copie o ID do vídeo da URL

**Exemplo de URL do TikTok:**
```
https://www.tiktok.com/@pekelmon/video/7123456789012345678
```
O ID é: `7123456789012345678`

### No Código:

```javascript
posts: [
  { id: 1, postUrl: "https://www.tiktok.com/@pekelmon/video/7123456789012345678", embedUrl: "https://www.tiktok.com/embed/7123456789012345678" },
  { id: 2, postUrl: "https://www.tiktok.com/@pekelmon/video/7234567890123456789", embedUrl: "https://www.tiktok.com/embed/7234567890123456789" },
  { id: 3, postUrl: "https://www.tiktok.com/@pekelmon/video/7345678901234567890", embedUrl: "https://www.tiktok.com/embed/7345678901234567890" },
  { id: 4, postUrl: "https://www.tiktok.com/@pekelmon/video/7456789012345678901", embedUrl: "https://www.tiktok.com/embed/7456789012345678901" },
]
```

## 👥 Facebook (PadreKelmon)

### Como Obter os IDs:

1. Acesse: https://www.facebook.com/PadreKelmon
2. Abra os **4 últimos posts** publicados
3. Copie o ID do post da URL

**Exemplo de URL do Facebook:**
```
https://www.facebook.com/PadreKelmon/posts/123456789012345
```
O ID é: `123456789012345`

### No Código:

```javascript
posts: [
  { id: 1, postUrl: "https://www.facebook.com/PadreKelmon/posts/123456789012345", embedUrl: "" },
  { id: 2, postUrl: "https://www.facebook.com/PadreKelmon/posts/234567890123456", embedUrl: "" },
  { id: 3, postUrl: "https://www.facebook.com/PadreKelmon/posts/345678901234567", embedUrl: "" },
  { id: 4, postUrl: "https://www.facebook.com/PadreKelmon/posts/456789012345678", embedUrl: "" },
]
```

**Nota:** Facebook geralmente não permite embed direto, então o `embedUrl` fica vazio.

## ✅ Após Fazer as Mudanças

1. Salve o arquivo `src/components/landing/media.tsx`
2. O site atualizará automaticamente
3. Os embeds do Instagram, YouTube e TikTok aparecerão nos cards
4. Para Facebook, aparecerá o placeholder com link para o post

## 🔄 Atualização Regular

Recomenda-se atualizar essas URLs:
- **Semanalmente** - para manter o conteúdo fresco
- **Após posts importantes** - eventos, anúncios, etc.
- **Antes de campanhas** - para garantir relevância

## 📞 Suporte

Se tiver dúvidas sobre como obter os códigos:
1. Abra o navegador em modo anônimo
2. Acesse a rede social
3. Copie a URL completa do post
4. Extraia apenas o código/ID conforme exemplos acima
