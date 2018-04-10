function! s:start_markdown_server()
  let path = expand('%:p')
  execute('! vim-markdown-renderer --file '.path)
endfunction

augroup markdownRenderer
  autocmd!
  autocmd FileType markdown,md call <SID>start_markdown_server()
augroup End
