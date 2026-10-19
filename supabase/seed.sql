-- Dados iniciais de exemplo. Ajuste nomes, preços e durações à vontade.

insert into public.servicos (nome, descricao, preco_centavos, duracao_min, ordem) values
  ('Corte de Cabelo',      'Tesoura e/ou máquina, lavagem e finalização.',        5000, 40, 1),
  ('Barba',                'Navalha, toalha quente e balm hidratante.',           4000, 30, 2),
  ('Combo Cabelo + Barba', 'O pacote completo da estrada.',                       8000, 70, 3),
  ('Toalha Quente',        'Ritual de toalha quente com óleos essenciais.',       2000, 15, 4),
  ('Pezinho / Acabamento', 'Contorno e acabamento entre um corte e outro.',       2000, 15, 5);

insert into public.barbeiros (nome, bio) values
  ('Elvis',  'Pompadour, degradê e clássicos dos anos 50.'),
  ('Johnny', 'Especialista em barba e navalha.'),
  ('Joan',   'Cortes modernos, freestyle e desenhos.');

-- Para dar acesso ao painel a um barbeiro:
-- 1. Supabase > Authentication > Users > Add user (e-mail + senha).
-- 2. Copie o "User UID" do usuário criado e rode:
--    update public.barbeiros set auth_user_id = 'COLE-O-UID-AQUI' where nome = 'Elvis';
