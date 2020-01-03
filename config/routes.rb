Rails.application.routes.draw do

root 'games#index'
resources :games do
  collection do
    get 'easy'
  end
end

end
