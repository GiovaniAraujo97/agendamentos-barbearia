export class ErrorTranslator {
  static translate(error: any): string {
    const rawMessage = error?.message || '';
    const message = rawMessage.toLowerCase();

    // Erros de autenticação
    if (message.includes('invalid login credentials')) {
      return 'Email ou senha incorretos.';
    }
    if (message.includes('email not confirmed')) {
      return 'Email ainda não confirmado. Verifique sua caixa de entrada.';
    }
    if (message.includes('user already registered')) {
      return 'Este email já está cadastrado. Tente fazer login ou use outro email.';
    }
    if (message.includes('password should be at least')) {
      return 'A senha deve ter pelo menos 6 caracteres.';
    }
    if (message.includes('invalid email')) {
      return 'Email inválido.';
    }

    // Erros de banco de dados
    if (message.includes('could not find the table') || message.includes('schema cache')) {
      return 'A estrutura do banco não está completa. Rode as migrações no Supabase.';
    }
    if (message.includes('appointments_client_id_fkey')) {
      return 'Sua conta de cliente não está ativa no sistema. Faça login novamente ou cadastre-se de novo para agendar.';
    }
    if (message.includes('appointments_service_id_fkey')) {
      return 'O serviço selecionado não está mais disponível. Atualize a página e escolha outro serviço.';
    }
    if (message.includes('appointments_professional_id_fkey')) {
      return 'O profissional selecionado não está mais disponível. Atualize a página e tente novamente.';
    }
    if (message.includes('violates foreign key')) {
      return 'Erro de integridade nos dados. Algum registro referenciado não existe.';
    }
    if (message.includes('permission denied')) {
      return 'Você não tem permissão para acessar este recurso.';
    }

    // Erros de perfil/usuário
    if (message.includes('perfil do usuário não encontrado')) {
      return 'Sua conta foi removida do sistema. Faça cadastro novamente.';
    }
    if (message.includes('usuário não autenticado')) {
      return 'Faça login para concluir o agendamento.';
    }
    if (message.includes('perfil do cliente não encontrado')) {
      return 'Seu cadastro de cliente não foi encontrado. Faça login novamente ou crie sua conta outra vez.';
    }

    // Padrão: usar a mensagem original ou fallback
    return rawMessage || 'Erro desconhecido. Tente novamente.';
  }
}
