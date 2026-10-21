# Instruções para Substituir as Imagens do Padre Kelmon

## Imagens a serem substituídas:

### 1. Imagem do Hero (Principal - com fundo azul)
**Arquivo:** `src/assets/hero-bg.jpg`
**Usar:** A imagem com o texto "Agora é OFICIAL" e fundo azul gradiente
**Descrição:** Esta é a imagem de fundo do hero

### 2. Foto do Padre Kelmon (Retrato oficial)
**Arquivo:** `src/assets/hero-portrait.jpg`
**Usar:** A foto do Padre Kelmon com fundo preto (batina preta e roxa)
**Descrição:** Esta é a foto que aparece ao lado do texto principal

## Como substituir:

### Opção 1 - Manualmente pelo Windows Explorer:
1. Salve as duas imagens do chat
2. Renomeie-as conforme indicado acima
3. Cole-as na pasta: `src\assets\`
4. Substitua os arquivos existentes

### Opção 2 - Via PowerShell:
```powershell
# Navegue até a pasta do projeto
cd "C:\Users\Marketing\Desktop\Padre Kelmon\kelmon-sua-voz-em-sp-main\kelmon-sua-voz-em-sp-main"

# Copie a imagem do background (ajuste o caminho de origem)
Copy-Item "C:\Downloads\imagem-oficial-fundo-azul.jpg" "src\assets\hero-bg.jpg" -Force

# Copie a foto do Padre (ajuste o caminho de origem)
Copy-Item "C:\Downloads\foto-padre-kelmon.jpg" "src\assets\hero-portrait.jpg" -Force
```

## Depois de substituir:
O site irá recarregar automaticamente e você verá as novas imagens!

## Tamanhos recomendados:
- **hero-bg.jpg**: 1920x1080px ou similar (landscape)
- **hero-portrait.jpg**: 1024x1280px ou similar (portrait 3:4 ou 4:5)
