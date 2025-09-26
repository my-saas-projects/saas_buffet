#!/bin/bash
"""
Script para instalar dependências e executar o script de inserção de dados
"""

echo "🎯 BuffetFlow - Instalador de Dependências e Inserção de Dados"
echo "=============================================================="

# Verificar se estamos no diretório correto
if [ ! -f "insert_mass_data.py" ]; then
    echo "❌ Erro: Script insert_mass_data.py não encontrado!"
    echo "   Execute este script no diretório raiz do projeto (saas_buffet/)"
    exit 1
fi

# Verificar se o backend existe
if [ ! -d "backend" ]; then
    echo "❌ Erro: Diretório backend não encontrado!"
    echo "   Execute este script no diretório raiz do projeto"
    exit 1
fi

echo "📦 Instalando dependências Python..."

# Navegar para o backend
cd backend

# Verificar se o ambiente virtual existe
if [ ! -d "venv_saas_buffet" ]; then
    echo "🔧 Criando ambiente virtual..."
    python3 -m venv venv_saas_buffet
fi

# Ativar ambiente virtual
echo "🔧 Ativando ambiente virtual..."
source venv_saas_buffet/bin/activate

# Instalar dependências
echo "📦 Instalando dependências do Django..."
pip install -r requirements.txt

# Instalar Faker se não estiver instalado
echo "📦 Instalando Faker para dados fake..."
pip install faker

# Voltar para o diretório raiz
cd ..

echo "✅ Dependências instaladas com sucesso!"
echo ""
echo "🚀 Executando script de inserção de dados..."
echo ""

# Executar o script Python
python3 insert_mass_data.py

echo ""
echo "🎉 Processo concluído!"
echo ""
echo "💡 Próximos passos:"
echo "   1. Acesse o admin Django: http://localhost:8000/admin/"
echo "   2. Use as credenciais 'teste123' para fazer login"
echo "   3. Teste todas as funcionalidades do sistema"
echo ""
echo "🔧 Para iniciar o servidor Django:"
echo "   cd backend"
echo "   source venv_saas_buffet/bin/activate"
echo "   python manage.py runserver"
