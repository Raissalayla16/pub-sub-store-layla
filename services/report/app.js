const RabbitMQService = require('./rabbitmq-service');
const path = require('path');

// Carrega variáveis de ambiente
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Objeto para armazenar o relatório
const report = {};

// Atualiza o relatório com produtos vendidos
async function updateReport(products) {
    for (const product of products) {
        if (!product.name) continue;
        report[product.name] = (report[product.name] || 0) + 1;
    }
}

// Imprime o relatório formatado
async function printReport() {
    console.log("📊 RELATÓRIO DE VENDAS");
    console.log("-----------------------");
    for (const [product, quantity] of Object.entries(report)) {
        console.log(`➤ ${product}: ${quantity} venda(s)`);
    }
    console.log("-----------------------\n");
}

// Consome mensagens da fila 'report'
async function consume() {
    try {
        // 1. Conecta ao RabbitMQ
        const rabbitMQ = await RabbitMQService.getInstance();
        
        // 2. Configura o consumidor da fila 'report'
        await rabbitMQ.consume('report', async (msg) => {
            const orderData = JSON.parse(msg.content.toString());
            
            console.log(`🛒 Nova venda recebida: ${orderData.clientFullName}`);
            
            // 3. Atualiza e exibe o relatório
            await updateReport(orderData.products);
            await printReport();
        });

        console.log("✅ Report-service pronto para consumir mensagens...");
    } catch (error) {
        console.error("❌ Erro no report-service:", error);
    }
}

// Inicia o serviço
consume();
/*const RabbitMQService = require('./rabbitmq-service')
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '.env') })

var report = {}
async function updateReport(products) {
    for(let product of products) {
        if(!product.name) {
            continue
        } else if(!report[product.name]) {
            report[product.name] = 1;
        } else {
            report[product.name]++;
        }
    }

}

async function printReport() {
    for (const [key, value] of Object.entries(report)) {
        console.log(`${key} = ${value} vendas`);
      }
}

async function consume() {
    //TODO: Constuir a comunicação com a fila 
} 

consume()*/
