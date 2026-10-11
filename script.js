/* ==============================================
   CARRINHO DE COMPRAS — Art Store
   ✅ AJUSTADO EXATAMENTE PARA SEU HTML
   ✅ Itens aparecendo | Limpar funcionando
   ============================================== */
let carrinho = [];

/* ==============================================
   INICIALIZAÇÃO — ESPERA A PÁGINA CARREGAR
   ============================================== */
document.addEventListener('DOMContentLoaded', function() {
    carregarCarrinhoSalvo();
    atualizarContador();
    ligarBotoesAdicionar();
    
    // SE ESTIVER NA PÁGINA DO CARRINHO
    if (document.getElementById('carrinho-lista')) {
        setTimeout(function() {
            renderizarCarrinho();
            ligarBotoesDaPaginaCarrinho();
        }, 50);
    }
});

/* ==============================================
   CARREGA OS ITENS SALVOS NO NAVEGADOR
   ============================================== */
function carregarCarrinhoSalvo() {
    const salvo = localStorage.getItem('carrinhoArtStore');
    if (salvo) {
        try {
            carrinho = JSON.parse(salvo);
        } catch {
            carrinho = [];
            localStorage.removeItem('carrinhoArtStore');
        }
    }
}

/* ==============================================
   SALVA OS ITENS
   ============================================== */
function salvarCarrinho() {
    localStorage.setItem('carrinhoArtStore', JSON.stringify(carrinho));
}

/* ==============================================
   ✅ ATUALIZA O NÚMERO NO ÍCONE DO CARRINHO
   ============================================== */
function atualizarContador() {
    let total = 0;
    for (let i = 0; i < carrinho.length; i++) {
        total += carrinho[i].quantidade;
    }
    const contadores = document.querySelectorAll('.contador-carrinho');
    contadores.forEach(c => {
        c.textContent = total;
        c.style.display = total === 0 ? 'none' : 'flex';
    });
}

/* ==============================================
   ✅ BOTÃO "ADICIONAR AO CARRINHO" NAS PÁGINAS
   ============================================== */
function ligarBotoesAdicionar() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('botao-carrinho')) {
            const nome = e.target.getAttribute('data-produto');
            const preco = parseFloat(e.target.getAttribute('data-preco'));
            
            // VERIFICA SE JÁ EXISTE → AUMENTA QUANTIDADE
            let achou = false;
            for (let i = 0; i < carrinho.length; i++) {
                if (carrinho[i].nome === nome) {
                    carrinho[i].quantidade++;
                    achou = true;
                }
            }
            if (!achou) {
                carrinho.push({ nome: nome, preco: preco, quantidade: 1 });
            }
            
            salvarCarrinho();
            atualizarContador();
            
            // MENSAGEM DE CONFIRMAÇÃO
            const textoOriginal = e.target.textContent;
            e.target.textContent = '✅ Adicionado!';
            e.target.style.backgroundColor = '#28a745';
            setTimeout(() => {
                e.target.textContent = textoOriginal;
                e.target.style.backgroundColor = '';
            }, 1500);
        }
    });
}

/* ==============================================
   ✅ MOSTRA OS ITENS NA TELA DO CARRINHO
   ============================================== */
function renderizarCarrinho() {
    const lista = document.getElementById('carrinho-lista');
    const vazio = document.getElementById('carrinho-vazio');
    const resumo = document.getElementById('carrinho-resumo');
    
    if (!lista || !vazio || !resumo) return;

    // CARRINHO VAZIO
    if (carrinho.length === 0) {
        lista.innerHTML = '';
        vazio.style.display = 'block';
        resumo.style.display = 'none';
        atualizarValores();
        return;
    }

    // TEM ITENS → MOSTRA TUDO
    vazio.style.display = 'none';
    resumo.style.display = 'block';
    lista.innerHTML = '';

    for (let i = 0; i < carrinho.length; i++) {
        const item = carrinho[i];
        const subtotal = (item.preco * item.quantidade).toFixed(2).replace('.', ',');
        
        const div = document.createElement('div');
        div.className = 'item-carrinho';
        div.innerHTML = `
            <div class="info-produto">
                <h3>${item.nome}</h3>
                <p class="preco-unitario">R$ ${item.preco.toFixed(2).replace('.', ',')} cada</p>
            </div>
            <div class="quantidade">
                <button data-indice="${i}" data-acao="diminuir">−</button>
                <span>${item.quantidade}</span>
                <button data-indice="${i}" data-acao="aumentar">+</button>
            </div>
            <div class="subtotal-item">R$ ${subtotal}</div>
            <button class="remover" data-indice="${i}">🗑️</button>
        `;
        lista.appendChild(div);
    }

    atualizarValores();
}

/* ==============================================
   ✅ CALCULA SUBTOTAL E TOTAL (SEM FRETE)
   ============================================== */
function atualizarValores() {
    let subtotal = 0;
    for (let i = 0; i < carrinho.length; i++) {
        subtotal += carrinho[i].preco * carrinho[i].quantidade;
    }
    
    const elSubtotal = document.getElementById('subtotal');
    const elTotal = document.getElementById('total');
    
    if (elSubtotal) elSubtotal.textContent = 'R$ ' + subtotal.toFixed(2).replace('.', ',');
    if (elTotal) elTotal.textContent = 'R$ ' + subtotal.toFixed(2).replace('.', ',');
}

/* ==============================================
   ✅ AÇÕES DENTRO DO CARRINHO (+ − 🗑️ LIMPAR)
   ============================================== */
function ligarBotoesDaPaginaCarrinho() {
    const lista = document.getElementById('carrinho-lista');
    if (!lista) return;

    // CLICAR EM + − 🗑️
    lista.addEventListener('click', function(e) {
        const botao = e.target.closest('button');
        if (!botao) return;
        
        const indice = parseInt(botao.getAttribute('data-indice'));
        const acao = botao.getAttribute('data-acao');

        if (acao === 'aumentar') {
            carrinho[indice].quantidade++;
        } else if (acao === 'diminuir') {
            if (carrinho[indice].quantidade > 1) {
                carrinho[indice].quantidade--;
            }
        } else if (botao.classList.contains('remover')) {
            carrinho.splice(indice, 1);
        }

        salvarCarrinho();
        atualizarContador();
        renderizarCarrinho();
    });

    // ✅ BOTÃO LIMPAR CARRINHO — ZERA TUDO DE VERDADE
    const botaoLimpar = document.getElementById('botao-limpar');
    if (botaoLimpar) {
        botaoLimpar.addEventListener('click', function() {
            if (confirm('Tem certeza que deseja limpar o carrinho?')) {
                carrinho = [];                     // ESVAZIA A LISTA
                localStorage.removeItem('carrinhoArtStore'); // APAGA DO NAVEGADOR
                atualizarContador();               // ZERA O NÚMERO
                renderizarCarrinho();               // VOLTA A TELA DE VAZIO
            }
        });
    }

    // ✅ BOTÃO FINALIZAR COMPRA
    const botaoFinalizar = document.getElementById('botao-finalizar');
    if (botaoFinalizar) {
        botaoFinalizar.addEventListener('click', function() {
            const elTotal = document.getElementById('total');
            const valor = elTotal ? elTotal.textContent : 'R$ 0,00';
            alert('🎉 Compra sendo finalizada!\nTotal: ' + valor);
        });
    }
}