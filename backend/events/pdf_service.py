import io
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from django.conf import settings
from datetime import datetime, timedelta
import os


class ProposalPDFGenerator:
    def __init__(self, event):
        self.event = event
        self.company = event.company
        self.buffer = io.BytesIO()
        self.doc = SimpleDocTemplate(
            self.buffer,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18,
        )
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()

    def _setup_custom_styles(self):
        """Configura estilos personalizados para o PDF"""
        self.styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=self.styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=TA_CENTER,
            textColor=colors.darkblue,
        ))

        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading2'],
            fontSize=14,
            spaceAfter=12,
            spaceBefore=12,
            textColor=colors.darkblue,
        ))

        self.styles.add(ParagraphStyle(
            name='CompanyInfo',
            parent=self.styles['Normal'],
            fontSize=10,
            alignment=TA_CENTER,
            spaceAfter=20,
        ))

    def _add_company_header(self, story):
        """Adiciona cabeçalho da empresa com logo"""
        # Logo da empresa (se existir)
        if self.company.logo:
            try:
                logo_path = os.path.join(settings.MEDIA_ROOT, str(self.company.logo))
                if os.path.exists(logo_path):
                    logo = Image(logo_path)
                    logo.drawHeight = 1.5 * inch
                    logo.drawWidth = 2 * inch
                    logo.hAlign = 'CENTER'
                    story.append(logo)
                    story.append(Spacer(1, 12))
            except Exception:
                pass  # Se houver erro com o logo, continue sem ele

        # Informações da empresa
        company_info = f"""
        <b>{self.company.name}</b><br/>
        {self.company.business_name or ''}<br/>
        {self.company.address}<br/>
        {self.company.city} - {self.company.state} - {self.company.postal_code}<br/>
        Email: {self.company.email} | Telefone: {self.company.phone}<br/>
        {f'Site: {self.company.website}' if self.company.website else ''}
        """
        story.append(Paragraph(company_info, self.styles['CompanyInfo']))
        story.append(Spacer(1, 30))

    def _add_proposal_title(self, story):
        """Adiciona título da proposta"""
        title = f"PROPOSTA ORÇAMENTÁRIA<br/>#{self.event.id}"
        story.append(Paragraph(title, self.styles['CustomTitle']))
        story.append(Spacer(1, 20))

    def _add_client_info(self, story):
        """Adiciona informações do cliente"""
        story.append(Paragraph("DADOS DO CLIENTE", self.styles['SectionHeader']))

        client_data = [
            ['Nome:', self.event.client_name],
            ['Email:', self.event.client_email],
            ['Telefone:', self.event.client_phone],
        ]

        client_table = Table(client_data, colWidths=[2*inch, 4*inch])
        client_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(client_table)
        story.append(Spacer(1, 20))

    def _add_event_details(self, story):
        """Adiciona detalhes do evento"""
        story.append(Paragraph("DETALHES DO EVENTO", self.styles['SectionHeader']))

        event_data = [
            ['Título:', self.event.title],
            ['Tipo:', self.event.get_event_type_display()],
            ['Data:', self.event.event_date.strftime('%d/%m/%Y')],
            ['Horário:', f"{self.event.start_time.strftime('%H:%M')} às {self.event.end_time.strftime('%H:%M')}"],
            ['Número de Convidados:', str(self.event.guest_count)],
            ['Local:', self.event.venue_location or 'A definir'],
        ]

        if self.event.description:
            event_data.append(['Descrição:', self.event.description])

        if self.event.special_requirements:
            event_data.append(['Requisitos Especiais:', self.event.special_requirements])

        event_table = Table(event_data, colWidths=[2*inch, 4*inch])
        event_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        story.append(event_table)
        story.append(Spacer(1, 20))

    def _add_menu_items(self, story):
        """Adiciona itens do menu e orçamento"""
        menu_items = self.event.menu_items.all()

        if menu_items:
            story.append(Paragraph("ITENS DO CARDÁPIO", self.styles['SectionHeader']))

            # Cabeçalho da tabela
            menu_data = [['Item', 'Categoria', 'Valor/Pessoa', 'Qtd', 'Total']]

            total_event_cost = 0

            for event_menu in menu_items:
                item = event_menu.menu_item
                total_item = event_menu.total_price()
                total_event_cost += total_item

                menu_data.append([
                    item.name,
                    item.get_category_display(),
                    f"R$ {item.price_per_person:.2f}",
                    str(event_menu.quantity),
                    f"R$ {total_item:.2f}"
                ])

            # Adiciona linha de total
            menu_data.append(['', '', '', 'TOTAL:', f"R$ {total_event_cost:.2f}"])

            menu_table = Table(menu_data, colWidths=[2.5*inch, 1.5*inch, 1*inch, 0.8*inch, 1.2*inch])
            menu_table.setStyle(TableStyle([
                # Cabeçalho
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),

                # Dados
                ('FONTNAME', (0, 1), (-1, -2), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -2), 9),
                ('ALIGN', (0, 1), (0, -2), 'LEFT'),  # Nome do item alinhado à esquerda

                # Linha de total
                ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
                ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, -1), (-1, -1), 10),

                # Bordas
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
                ('TOPPADDING', (0, 0), (-1, -1), 6),
            ]))
            story.append(menu_table)
            story.append(Spacer(1, 20))
        else:
            story.append(Paragraph("ORÇAMENTO", self.styles['SectionHeader']))
            if self.event.final_price:
                price_info = f"Valor Total: R$ {self.event.final_price:.2f}"
            elif self.event.estimated_cost:
                price_info = f"Valor Estimado: R$ {self.event.estimated_cost:.2f}"
            elif self.event.value:
                price_info = f"Valor: R$ {self.event.value:.2f}"
            else:
                price_info = "Valor a ser definido"

            story.append(Paragraph(price_info, self.styles['Normal']))
            story.append(Spacer(1, 20))

    def _add_validity_and_terms(self, story):
        """Adiciona validade da proposta e termos"""
        story.append(Paragraph("VALIDADE E CONDIÇÕES", self.styles['SectionHeader']))

        # Data de validade
        if self.event.proposal_validity_date:
            validity_date = self.event.proposal_validity_date.strftime('%d/%m/%Y')
        else:
            # Se não tiver data definida, usa 30 dias a partir de hoje
            validity_date = (datetime.now().date() + timedelta(days=30)).strftime('%d/%m/%Y')

        terms_text = f"""
        <b>Validade da Proposta:</b> {validity_date}<br/><br/>

        <b>Condições Gerais:</b><br/>
        • Esta proposta é válida até a data especificada acima<br/>
        • Os valores podem sofrer alterações caso haja mudanças no número de convidados ou itens do cardápio<br/>
        • O agendamento do evento será confirmado mediante assinatura de contrato e pagamento de sinal<br/>
        • Alterações no cardápio devem ser comunicadas com antecedência mínima de 7 dias<br/>
        • Em caso de cancelamento, consulte nossos termos de cancelamento<br/><br/>

        <b>Observações:</b><br/>
        {self.event.notes or 'Nenhuma observação adicional.'}
        """

        story.append(Paragraph(terms_text, self.styles['Normal']))
        story.append(Spacer(1, 30))

    def _add_footer(self, story):
        """Adiciona rodapé com informações de contato"""
        footer_text = f"""
        <para alignment="center">
        <b>Entre em contato para mais informações ou esclarecimentos:</b><br/>
        {self.company.email} | {self.company.phone}<br/>
        Obrigado pela preferência!
        </para>
        """
        story.append(Paragraph(footer_text, self.styles['Normal']))

    def generate_pdf(self):
        """Gera o PDF completo"""
        story = []

        # Adiciona todas as seções
        self._add_company_header(story)
        self._add_proposal_title(story)
        self._add_client_info(story)
        self._add_event_details(story)
        self._add_menu_items(story)
        self._add_validity_and_terms(story)
        self._add_footer(story)

        # Constrói o PDF
        self.doc.build(story)

        # Retorna o conteúdo do buffer
        pdf_content = self.buffer.getvalue()
        self.buffer.close()

        return pdf_content


def generate_event_proposal_pdf(event):
    """Função helper para gerar PDF de proposta de evento"""
    generator = ProposalPDFGenerator(event)
    return generator.generate_pdf()