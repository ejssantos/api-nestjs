begin
  insert into dev.produtos(cd_produto, ds_produto, vl_unit, perc_desc, qt_estoque, sn_ativo)
    values(1, 'Chaveador Kvm Switch Para Ligar 2 Computadores Mouse Teclado', 146.30, 0, 50, 'S');

  insert into dev.produtos(cd_produto, ds_produto, vl_unit, perc_desc, qt_estoque, sn_ativo)
    values(2, 'Placa Pci Com 5 Portas Usb 2.0 Dex - Dp-52', 58.90, 5, 100, 'S');
    
  insert into dev.produtos(cd_produto, ds_produto, vl_unit, perc_desc, qt_estoque, sn_ativo)
    values(3, 'Livro - Aplicações Da Informática na Construção De Conceitos', 19.98, 0, 10, 'S');
    
  insert into dev.produtos(cd_produto, ds_produto, vl_unit, perc_desc, qt_estoque, sn_ativo)
    values(4, 'Hub Usb 3.0 - 3 Portas + Adaptador Rj45 Ethernet Gigabit Exbom', 56.90, 0, 85, 'S');
    
  insert into dev.produtos(cd_produto, ds_produto, vl_unit, perc_desc, qt_estoque, sn_ativo)
    values(5, 'Placa Pci-e 2 Portas Usb 3.0 + 1 Porta Type C Dex - Dp-33c', 129.00, 0, 0, 'N');
    
  insert into dev.produtos(cd_produto, ds_produto, vl_unit, perc_desc, qt_estoque, sn_ativo)
    values(6, 'Cabo Y Vga Macho X 2 Vga Fêmea 15 Pinos - Avy-1M/2F - Vinik', 14.35, 0, 30, 'S');

  insert into dev.produtos(cd_produto, ds_produto, vl_unit, perc_desc, qt_estoque, sn_ativo)
    values(7
      , 'Notebook Gamer ASUS F15 Intel Core i7 12700h 2,3 GHz 8GB RAM 512GB SSD Linux NVidia GeForce 15,6'
      , 5792.21, 3, 5, 'N'
    );

  commit;
end;