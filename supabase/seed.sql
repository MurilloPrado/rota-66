-- Dados iniciais. Ajuste nomes, preços e durações à vontade.

insert into public.servicos (nome, descricao, preco_centavos, duracao_min, ordem) values
  ('Corte Masculino',                'Tesoura e/ou máquina, lavagem e finalização.', 4500, 40, 1),
  ('Barba Tradicional',              'Navalha, toalha quente e balm hidratante.',    3000, 30, 2),
  ('Combo Rota 66 (Cabelo + Barba)', 'O pacote completo da estrada.',                6600, 70, 3),
  ('Sobrancelha',                    'Limpeza e alinhamento na navalha.',            1500, 15, 4);

insert into public.barbeiros (nome, bio) values
  ('Elvis',  'Pompadour, degradê e clássicos dos anos 50.'),
  ('Johnny', 'Especialista em barba e navalha.'),
  ('Joan',   'Cortes modernos, freestyle e desenhos.');

-- Para dar acesso ao painel a um barbeiro:
-- 1. Supabase > Authentication > Users > Add user (e-mail + senha).
-- 2. Copie o "User UID" do usuário criado e rode:
--    update public.barbeiros set auth_user_id = 'COLE-O-UID-AQUI' where nome = 'Elvis';
