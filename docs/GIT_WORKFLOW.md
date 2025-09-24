# Fluxo de Trabalho Git

Este projeto utiliza um fluxo de trabalho baseado em feature branches.

## Branches

-   `main`: A branch principal. Contém o código de produção estável. Apenas merges de `develop` são permitidos.
-   `develop`: A branch de desenvolvimento. Contém as funcionalidades mais recentes que serão incluídas na próxima release. Todo o desenvolvimento é feito a partir desta branch.
-   `feature/<nome-da-feature>`: Branches para novas funcionalidades. São criadas a partir de `develop`.
-   `fix/<nome-da-correcao>`: Branches para correções de bugs. São criadas a partir de `develop`.

## Fluxo

1.  Para iniciar o desenvolvimento de uma nova funcionalidade, crie uma nova branch a partir de `develop`:
    ```bash
    git checkout develop
    git pull
    git checkout -b feature/minha-nova-feature
    ```

2.  Faça commits atômicos e com mensagens claras.

3.  Após a conclusão da funcionalidade, abra um Pull Request (PR) para a branch `develop`.

4.  Após a aprovação e o merge do PR, a branch da feature pode ser deletada.

## Mensagens de Commit

Use o padrão Conventional Commits. Exemplo:

-   `feat: Adiciona sistema de login com JWT`
-   `fix: Corrige cálculo de imposto no carrinho`
-   `docs: Atualiza o guia de iniciação`
